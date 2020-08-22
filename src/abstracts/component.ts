import { ParserUtil } from "../parser_util";
import { HTML_TAG } from "../enums";
import { nextTick } from "../helpers";
import { IPropOption } from "../interface";
import { globalFilters } from "../constant";

const blackListProperty = {
    "template": true,
    "element_": true,
    "dependency_": true
}

let uniqueCounter = 0


export abstract class Component {
    children: { [key: string]: typeof Component }
    private element_: HTMLElement;
    template: string;

    watchList: {
        [key: string]: Array<(newValue, oldValue) => void>
    } = {};

    addProp(name: string, option: IPropOption | any) {
        if ((this as any).prototype.$_props == null) {
            (this as any).prototype.$_props = {};
        }
        (this as any).prototype.$_props = option;
    }

    watch(propName: string, cb: (newValue, oldValue) => void) {
        if (this.watchList[propName] == null) {
            this.watchList[propName] = [];
        }
        this.watchList[propName].push(cb);
    }

    private dependency_: { [key: string]: any[] } = {};

    private parent_: Component;

    constructor() {
        nextTick(() => {
            this.attachGetterSetter$$();
            this.emit("created");
        })
        if (this.children == null) {
            this.children = {};
        }
    }

    get unique() {
        return ++uniqueCounter;
    }

    private attachGetterSetter$$() {
        const that = this;
        const cached = {};
        if (!this.$_props) {
            this.$_props = {};
        }
        Object.keys(this).forEach(key => {
            if (!blackListProperty[key] && !this.$_props[key]) {
                cached[key] = this[key];
                Object.defineProperty(this, key, {
                    set(newValue) {
                        const oldValue = cached[key];
                        cached[key] = newValue;
                        nextTick(() => {
                            if (that.watchList[key]) {
                                that.watchList[key].forEach(cb => {
                                    cb(newValue, oldValue);
                                })
                            }
                            that.updateDOM$$(key);
                        })
                    },
                    get() {
                        return cached[key];
                    }
                });

                if (Array.isArray(this[key])) {
                    Object.defineProperty(this[key], "push", {
                        value: function (...args) {
                            let result = Array.prototype.push.apply(this, args);
                            nextTick(() => {
                                that.onArrayModified$$(key, 'push', args[0]);
                            });
                            return result;
                        }
                    });
                }
            }
        })
    }

    private onArrayModified$$(key: string, method: string, newValue?) {
        for (const prop in this.dependency_) {
            if (prop === key) {
                const values = this.dependency_[prop].filter(q => q.forExp === true);
                switch (method) {
                    case 'push':
                        values.forEach(item => {
                            const newElement = item.method(newValue, this[key].length - 1);
                            (item.lastEl as HTMLElement).parentNode.insertBefore(newElement, item.lastEl.nextSibling);
                            item.lastEl = newElement;
                        });
                        break;
                }
                console.log("value", values);
                return;
            }
        }
    }

    private updateDOM$$(key: string) {

        for (const prop in this.dependency_) {
            if (prop === key) {
                const depItems = this.dependency_[prop];
                depItems.forEach(item => {
                    switch (item.nodeType) {
                        // Text Node
                        case 3:
                            item.nodeValue = this[key]; break;
                        // Input node 
                        case 1:
                            (item as HTMLInputElement).value = this[key];
                            break;
                        default:
                            if (item.ifExp) {
                                const el = item.method();
                                (item.el as HTMLElement).parentNode.replaceChild(
                                    el, item.el
                                )
                                item.el = el;
                            }
                    }
                });
                return;
            }
        }
    }

    private storeIfExp_(method: Function, keys: string[], id: string) {
        const el = method();
        const dep = {
            el: el,
            method: method,
            id: id,
            ifExp: true
        }
        keys.forEach(item => {
            this.storeDependency$$(item, dep);
        })
        return el;
    }

    private storeForExp_(key, method: Function, id: string) {
        const els = this[key].map((item, i) => {
            return method(item, i);
        });
        const lastEl = els[els.length - 1];
        this.storeDependency$$(key, {
            forExp: true,
            method: method,
            lastEl: lastEl,
            id: id
        });
        if (lastEl) {
            new MutationObserver((mutationsList, observer) => {
                if (document.body.contains(lastEl) === false) {
                    observer.disconnect();
                    const depIndex = this.dependency_[key].findIndex(q => q.id === id);
                    this.dependency_[key].splice(depIndex, 1);
                }
            }).observe(this.element_, { childList: true, subtree: true });
        }
        return els;
    }

    render: () => void;

    executeRender$$() {
        const renderFn = this.render || (() => {
            //compile
            const compiledTemplate = ParserUtil.parseview(this.template);
            console.log("compiled", compiledTemplate);
            return ParserUtil.createRenderer(compiledTemplate);
        })()
        console.log("renderer", renderFn);
        this.element_ = renderFn.call(this);
        nextTick(() => {
            new MutationObserver((mutationsList, observer) => {
                if (document.body.contains(this.element_) === false) {
                    observer.disconnect();
                    this.clearAll$$();
                }
            }).observe(document.body, { childList: true, subtree: true });
            this.emit("rendered");
        })
        return this.element_;
    }


    createTextNode(value, propDependency) {
        const el = document.createTextNode(value);
        if (propDependency) {
            this.storeDependency$$(propDependency, el);
        }
        return el;
    }

    private storeDependency$$(key: string, value) {
        if (this[key] == null) {
            return;
        }
        if (this.dependency_[key] == null) {
            this.dependency_[key] = [value];
        }
        else if (this.dependency_[key].findIndex(q => q.id === value.id) < 0) {
            this.dependency_[key].push(value);
        }
    }

    createCommentNode() {
        return document.createComment("");
    }

    private events_: {
        [key: string]: Function[]
    } = {};

    on(event: string, cb: Function) {
        if (this.events_[event] == null) {
            this.events_[event] = [];
        }
        this.events_[event].push(cb);
        return this;
    }

    emit(event: string, data?: any) {
        if (this.events_[event]) {
            this.events_[event].forEach(cb => {
                cb(data);
            })
        }
    }

    createElement(tag, childs: HTMLElement[], option) {
        let element;
        if (HTML_TAG[tag]) {
            element = document.createElement(tag) as HTMLElement;
            childs.forEach((item) => {
                element.appendChild(item);
            });

            if (option.html) {
                (element as HTMLElement).innerHTML = option.html;
            }

            if (option.attr) {
                const attr = option.attr;
                for (const key in attr) {
                    element.setAttribute(key, attr[key].v);
                }
            }

            if (option.on) {
                const events = option.on;
                for (const eventName in events) {
                    if (events[eventName]) {
                        element['on' + eventName] = events[eventName].bind(this);
                    }
                    else {
                        throw `Invalid event handler for event ${eventName}, Handler does not exist`;
                    }
                }
            }
        }
        else if (this.children[tag]) {
            const component: Component = new (this.children[tag] as any)();
            const htmlAttributes = [];
            if (option.attr) {
                const attr = option.attr;
                for (const key in attr) {
                    const value = attr[key];
                    if (component.$_props[key]) {
                        component[key] = value.v;
                        this.watch(value.k, (newValue) => {
                            component[key] = newValue;
                            component.updateDOM$$(key);
                        });
                    }
                    else {
                        htmlAttributes.push({
                            key,
                            value: value.v
                        })
                    }
                }
            }
            if (option.on) {
                const events = option.on;
                for (const eventName in events) {
                    if (events[eventName]) {
                        component.on(eventName, events[eventName].bind(this));
                    }
                    else {
                        throw `Invalid event handler for event ${eventName}, Handler does not exist`;
                    }
                }
            }
            element = component.element_ = component.executeRender$$();
            htmlAttributes.forEach(item => {
                element.setAttribute(item.key, item.value);
            })

        }
        else {
            throw `Invalid Component ${tag}. If you have created a component, Please register your component.`;
        }


        if (option.dep) {
            option.dep.forEach(item => {
                this.storeDependency$$(item, element);
            });
        }
        return element;

    }

    clearAll$$() {
        this.events_ = null;
        this.watchList = null;
        this.emit("destroyed");
    }

    query(selector: string) {
        return this.element_.querySelector(selector);
    }

    queryAll(selector: string) {
        return this.element_.querySelectorAll(selector);
    }

    queryByName(name: string) {
        return this.queryAllByName(name)[0];
    }

    queryAllByName(name: string) {
        return (this.element_ as any).getElementsByName(name);
    }

    queryById(id: string) {
        return (this.element_ as any).getElementById(id);
    }

    onRendered(cb) {
        this.on("rendered", cb);
    }

    onCreated(cb) {
        this.on("created", cb);
    }

    onDestroyed(cb) {
        this.on("destroyed", cb);
    }

    $filter(name: string, value) {
        if (globalFilters[name]) {
            return globalFilters[name](value);
        }
        else if (this.$_filters[name]) {
            return this.$_filters[name](value);
        }
        throw `Can not find filter ${name}`;
    }

    private $_filters;
    private $_props;

}
import { ParserUtil } from "../parser_util";
import { HTML_TAG } from "../enums";
import { nextTick } from "../helpers";
import { IPropOption } from "../interface";

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
    props: {
        [key: string]: IPropOption | any
    } = {};

    watch: {
        [key: string]: (oldValue, newValue) => void
    } = {};

    private dependency_: { [key: string]: any[] } = {};

    private parent_: Component;

    constructor() {
        nextTick(() => {
            this.attachGetterSetter_();
            this.emit("created");
        })
        if (this.children == null) {
            this.children = {};
        }
    }

    get unique() {
        return ++uniqueCounter;
    }

    private attachGetterSetter_() {
        // call created
        const that = this;
        const cached = {};
        Object.keys(this).forEach(key => {
            if (!blackListProperty[key]) {
                cached[key] = this[key];
                Object.defineProperty(this, key, {
                    set(newValue) {
                        const oldValue = cached[key];
                        cached[key] = newValue;
                        nextTick(() => {
                            that.watch[key](oldValue, newValue);
                            that.updateDOM_(key);
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
                                that.onArrayModified_(key, 'push', args[0]);
                            });
                            return result;
                        }
                    });
                }
            }

        })
    }

    private onArrayModified_(key: string, method: string, newValue?) {
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

    private updateDOM_(key: string) {

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
            this.storeDependency_(item, dep);
        })
        return el;
    }

    private storeForExp_(key, method: Function, id: string) {
        const els = this[key].map((item, i) => {
            return method(item, i);
        });
        const lastEl = els[els.length - 1];
        this.storeDependency_(key, {
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

    executeRender_() {
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
                    this.clearAll_();
                }
            }).observe(document.body, { childList: true, subtree: true });
            this.emit("rendered");
        })
        return this.element_;
    }


    createTextNode(value, propDependency) {
        const el = document.createTextNode(value);
        if (propDependency) {
            this.storeDependency_(propDependency, el);
        }
        return el;
    }

    private storeDependency_(key: string, value) {
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
            if (option.attr) {
                const attr = option.attr;
                for (const key in attr) {
                    element.setAttribute(key, attr[key]);
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
                    if (component.props[key]) {
                        component[key] = attr[key];
                    }
                    else {
                        htmlAttributes.push({
                            key,
                            value: attr[key]
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
            element = component.element_ = component.executeRender_();
            htmlAttributes.forEach(item => {
                element.setAttribute(item.key, item.value);
            })
        }
        else {
            throw `Invalid Component ${tag}. If you have created a component, Please register your component.`;
        }


        if (option.dep) {
            option.dep.forEach(item => {
                this.storeDependency_(item, element);
            });
        }
        return element;

    }

    clearAll_() {
        this.events_ = null;
        this.emit("destroyed");
    }
}
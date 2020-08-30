import { ParserUtil } from "../parser_util";
import { HTML_TAG } from "../enums";
import { nextTick } from "../helpers";
import { IPropOption, ITajStore } from "../interface";
import { globalFilters } from "../constant";


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

    private _$dependency: { [key: string]: any[] } = {};

    private _$parent: Component;

    constructor() {
        nextTick(() => {
            this._$attachGetterSetter();
            this.emit("created");
        })
        if (this.children == null) {
            this.children = {};
        }

    }

    get unique() {
        return ++uniqueCounter;
    }

    private _$attachGetterSetter() {
        const that = this;
        const cached = {};

        (this.$_reactives || []).forEach(key => {
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
                        that._$updateDOM(key);
                    })
                },
                get() {
                    return cached[key];
                }
            });

            if (Array.isArray(this[key])) {
                // Object.defineProperty(this[key], "push", {
                //     value: function (...args) {
                //         let result = Array.prototype.push.apply(this, args);
                //         nextTick(() => {
                //             that._$onArrayModified(key, 'push', args[0]);
                //         });
                //         return result;
                //     }
                // });
                this[key] = new Proxy(this[key], {
                    get(obj, prop) {
                        debugger;

                        return obj[prop]
                    },
                    set(obj, prop, value) {
                        debugger;
                        that._$onArrayModified(key, prop, value);
                        return true;
                    }
                })
            }
        })
    }

    private _$onArrayModified(key: string, prop, newValue?) {
        if (this._$dependency[key]) {
            const values = this._$dependency[key].filter(q => q.forExp === true);
            switch (prop) {
                case 'length':
                    return;
                default:
                    values.forEach(item => {
                        const newElement = item.method(newValue, prop);
                        // (item.lastEl as HTMLElement).parentNode.insertBefore(newElement, item.lastEl.nextSibling);
                        // item.lastEl = newElement;
                        const parent = (item.ref as Comment).parentNode;
                        if (prop === "0") {
                            (parent as HTMLElement).insertBefore(newElement, item.ref);
                        }
                        else {
                            const indexOfRef = Array.prototype.indexOf.call(parent.childNodes, item.ref);

                            if (this[key][prop]) {
                                // (item.parent as HTMLElement).insertBefore(newElement, item.parent.children[prop]);
                                parent.replaceChild(newElement, parent.childNodes[indexOfRef + Number(prop)]);
                            }
                            else {
                                // (item.parent as HTMLElement).appendChild(newElement);
                                (parent as HTMLElement).insertBefore(newElement, parent.childNodes[indexOfRef + 1 + Number(prop)]);
                            }
                        }

                    });
                    break;
            }
            console.log("value", values);
            return;
        }
    }

    private _$updateDOM(key: string) {

        for (const prop in this._$dependency) {
            if (prop === key) {
                const depItems = this._$dependency[prop];
                depItems.forEach(item => {
                    switch (item.nodeType) {
                        // Text Node
                        case 3:
                            item.nodeValue = this._$resolve(key); break;
                        // Input node 
                        case 1:
                            (item as HTMLInputElement).value = this._$resolve(key)
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
            this.__$storeDependency(item, dep);
        })
        return el;
    }

    private storeForExp_(key, method: Function, id: string) {
        const cmNode = this.createCommentNode();
        const els = [cmNode];
        this._$resolve(key).map((item, i) => {
            els.push(method(item, i));
        });
        nextTick(() => {
            this.__$storeDependency(key, {
                forExp: true,
                method: method,
                ref: cmNode,
                id: id
            });
            new MutationObserver((mutationsList, observer) => {
                if (document.body.contains(cmNode) === false) {
                    observer.disconnect();
                    const depIndex = this._$dependency[key].findIndex(q => q.id === id);
                    this._$dependency[key].splice(depIndex, 1);
                }
            }).observe(this.element_, { childList: true, subtree: true });
        });
        return els;
    }

    private _$resolve(path) {
        var properties = Array.isArray(path) ? path : path.split(".")
        return properties.reduce((prev, curr) => prev && prev[curr], this)
    }

    render: () => void;

    _$executeRender() {
        const renderFn = this.render || ParserUtil.createRenderer(this.template);
        console.log("renderer", renderFn);
        this.element_ = renderFn.call(this);
        nextTick(() => {
            new MutationObserver((mutationsList, observer) => {
                if (document.body.contains(this.element_) === false) {
                    observer.disconnect();
                    this._$clearAll();
                }
            }).observe(document.body, { childList: true, subtree: true });
            if ((this as any).$store) {

                for (let key in this._$dependency) {
                    if (key.indexOf("$store.state") >= 0) {
                        const cb = () => {
                            this._$updateDOM(key);
                        };
                        key = key.replace("$store.state.", '');
                        (this as any).$store.watch(key, cb);
                        this._$storeWatchCb.push({
                            key, cb
                        });
                    }
                }
            }
            this.emit("rendered");
        })
        return this.element_;
    }


    createTextNode(value, propDependency) {
        const el = document.createTextNode(value);
        if (propDependency) {
            this.__$storeDependency(propDependency, el);
        }
        return el;
    }

    private __$storeDependency(key: string, value) {
        // if (this[key] == null) {
        //     return;
        // }
        if (this._$dependency[key] == null) {
            this._$dependency[key] = [value];
        }
        else if (this._$dependency[key].findIndex(q => q.id === value.id) < 0) {
            this._$dependency[key].push(value);
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
            if (component._$storeGetters) {
                // can not make it async because if item is array then it will break
                // because at that time value will be undefined
                // so set it before rendering
                component._$storeGetters.forEach(item => {
                    component[item.prop] = component.$store.state[item.state];
                    const cb = (newValue) => {
                        component[item.prop] = newValue;
                        component._$updateDOM(item.prop);
                    }
                    component.$store.watch(item.state, cb);
                    component._$storeWatchCb.push({
                        key: item.state,
                        cb
                    });
                });
            }

            const htmlAttributes = [];
            if (option.attr) {
                const attr = option.attr;
                for (const key in attr) {
                    const value = attr[key];
                    if (component.$_props[key]) {
                        component[key] = value.v;
                        this.watch(value.k, (newValue) => {
                            component[key] = newValue;
                            component._$updateDOM(key);
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
            element = component.element_ = component._$executeRender();
            htmlAttributes.forEach(item => {
                element.setAttribute(item.key, item.value);
            })

        }
        else {
            throw `Invalid Component ${tag}. If you have created a component, Please register your component.`;
        }


        if (option.dep) {
            option.dep.forEach(item => {
                this.__$storeDependency(item, element);
            });
        }
        return element;

    }

    _$clearAll() {
        this.emit("destroyed");
        this._$storeWatchCb.forEach(item => {
            (this as any).$store.unwatch(item.key, item.cb)
        });
        this.events_ = null;
        this.watchList = null;
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

    $store: ITajStore;

    private $_filters;
    private $_props;
    private $_reactives;

    private _$storeWatchCb: { key: string, cb: Function }[] = [];

    private _$storeGetters: { prop: string, state: string }[];

}
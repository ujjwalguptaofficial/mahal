import { ParserUtil } from "../parser_util";
import { HTML_TAG, ERROR_TYPE } from "../enums";
import { nextTick, setAndReact, Observer } from "../helpers";
import { IPropOption, ITajStore } from "../interface";
import { globalFilters, MutationObserver } from "../constant";
import { isArray, isObject, isPrimitive, LogHelper, isNull } from "../utils";


let uniqueCounter = 0


export abstract class Component {
    children: { [key: string]: typeof Component }
    element: HTMLElement;
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
        new Observer(this).create((key, oldValue, newValue) => {
            if (this.watchList[key]) {
                this.watchList[key].forEach(cb => {
                    cb(newValue, oldValue);
                })
            }
            this._$updateDOM(key);
        }, (key) => {
            if (isArray(this[key])) {
                new Observer(this[key]).createForArray((arrayProp, params) => {
                    this._$onObjModified(key, arrayProp, params);
                })
            }
            else if (isObject(this[key])) {
                new Observer(this[key]).create((objectProp, oldValue, newValue) => {
                    this._$onObjModified(key, objectProp, oldValue);
                })
            }
        }, this.$_reactives || []);
    }

    private _$onObjModified(key: string, prop, params) {
        if (this._$dependency[key]) {
            this._$dependency[key].filter(q => q.forExp === true).forEach(item => {
                const parent = (item.ref as Comment).parentNode as HTMLElement;
                const indexOfRef = Array.prototype.indexOf.call(parent.childNodes, item.ref);
                switch (prop) {
                    case 'push':
                        var newElement = item.method(params.value, params.key);
                        (parent as HTMLElement).insertBefore(newElement, parent.childNodes[indexOfRef + params.length]);
                        break;
                    case 'splice':
                        for (let i = 1; i <= params[1]; i++) {
                            parent.removeChild(parent.childNodes[indexOfRef + params[0] + i]);
                        }
                        var newElement = item.method(params[2], params[0]);
                        (parent as HTMLElement).insertBefore(newElement, parent.childNodes[indexOfRef + 1 + params[0]]);
                        break;
                    default:
                        // if(isObject())
                        const resolvedValue = this._$resolve(key)
                        const index = Object.keys(resolvedValue).findIndex(q => q === prop);
                        if (index >= 0) {
                            var newElement = item.method(resolvedValue[prop], prop);
                            parent.replaceChild(newElement, parent.childNodes[indexOfRef + 1 + index]);
                        }
                    // values.forEach(item => {
                    //     const newElement = item.method(newValue, prop);
                    //     // (item.lastEl as HTMLElement).parentNode.insertBefore(newElement, item.lastEl.nextSibling);
                    //     // item.lastEl = newElement;
                    //     const parent = (item.ref as Comment).parentNode;
                    //     if (prop === "0") {
                    //         (parent as HTMLElement).insertBefore(newElement, item.ref);
                    //     }
                    //     else {
                    //         const indexOfRef = Array.prototype.indexOf.call(parent.childNodes, item.ref);

                    //         if (this[key][prop]) {
                    //             // (item.parent as HTMLElement).insertBefore(newElement, item.parent.children[prop]);
                    //             parent.replaceChild(newElement, parent.childNodes[indexOfRef + Number(prop)]);
                    //         }
                    //         else {
                    //             // (item.parent as HTMLElement).appendChild(newElement);
                    //             (parent as HTMLElement).insertBefore(newElement, parent.childNodes[indexOfRef + 1 + Number(prop)]);
                    //         }
                    //     }

                    // });
                    // break;
                }
            });
            // console.log("value", values);
            // return;
        }
    }

    $set(target, prop, valueToSet) {
        setAndReact(target, prop, valueToSet);
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
            this._$storeDependency(item, dep);
        })
        return el;
    }

    private storeForExp_(key, method: Function, id: string) {
        const cmNode = this.createCommentNode();
        const els = [cmNode];
        const resolvedValue = this._$resolve(key);

        if (process.env.NODE_ENV !== 'production') {
            if (isPrimitive(resolvedValue) || isNull(resolvedValue)) {
                throw new LogHelper(ERROR_TYPE.ForOnPrimitiveOrNull, key).getPlain();
            }
        }

        if (isArray(resolvedValue)) {
            resolvedValue.map((item, i) => {
                els.push(method(item, i));
            });
        }
        else if (isObject(resolvedValue)) {
            for (let key in resolvedValue) {
                els.push(method(resolvedValue[key], key));
            }
        }

        nextTick(() => {
            this._$storeDependency(key, {
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
            }).observe(this.element, { childList: true, subtree: true });
        });
        return els;
    }

    private _$resolve(path) {
        var properties = Array.isArray(path) ? path : path.split(".")
        return properties.reduce((prev, curr) => prev && prev[curr], this)
    }

    render: () => void;

    private _$executeRender() {
        const renderFn = this.render || ParserUtil.createRenderer(this.template);
        console.log("renderer", renderFn);
        this.element = renderFn.call(this);
        nextTick(() => {
            new MutationObserver((mutationsList, observer) => {
                if (document.body.contains(this.element) === false) {
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
        return this.element;
    }


    createTextNode(value, propDependency) {
        const el = document.createTextNode(value);
        if (propDependency) {
            this._$storeDependency(propDependency, el);
        }
        return el;
    }

    private _$storeDependency(key: string, value) {
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
            element = component.element = component._$executeRender();
            htmlAttributes.forEach(item => {
                element.setAttribute(item.key, item.value);
            })

        }
        else {
            throw `Invalid Component ${tag}. If you have created a component, Please register your component.`;
        }


        if (option.dep) {
            option.dep.forEach(item => {
                this._$storeDependency(item, element);
            });
        }
        return element;

    }

    private _$clearAll() {
        this.emit("destroyed");
        this._$storeWatchCb.forEach(item => {
            (this as any).$store.unwatch(item.key, item.cb)
        });
        this.events_ = null;
        this.watchList = null;
    }

    find(selector: string) {
        return this.element.querySelector(selector);
    }

    findAll(selector: string) {
        return this.element.querySelectorAll(selector);
    }

    findByName(name: string) {
        return this.findAllByName(name)[0];
    }

    findAllByName(name: string) {
        return (this.element as any).getElementsByName(name);
    }

    findById(id: string) {
        return (this.element as any).getElementById(id);
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
import { ParserUtil } from "../parser_util";
import { HTML_TAG, ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { setAndReact, Observer, deleteAndReact } from "../helpers";
import { IPropOption, ITajStore, IDirectiveBinding } from "../interface";
import { globalFilters, MutationObserver, globalComponents, globalDirectives } from "../constant";
import { isArray, isObject, isPrimitive, nextTick, LogHelper, isNull, getObjectLength } from "../utils";
import { genericDirective } from "../generics";

let uniqueCounter = 0;
function unique() {
    return ++uniqueCounter;
}

export abstract class Component {
    children: { [key: string]: typeof Component }
    element: HTMLElement;
    template: string;
    $store: ITajStore;

    constructor() {
        nextTick(() => {
            this.on(LIFECYCLE_EVENT.Rendered, this.rendered.bind(this));
            this.on(LIFECYCLE_EVENT.Created, this.created.bind(this));
            this.on(LIFECYCLE_EVENT.Destroyed, this.destroyed.bind(this));

            this.attachGetterSetter_();
            this.emit(LIFECYCLE_EVENT.Created);
        })
        if (this.children == null) {
            this.children = {};
        }
        if (this.filters_ == null) {
            this.filters_ = {};
        }
    }

    destroy() {
        this.element.parentNode.removeChild(this.element);
    }

    addProp(name: string, option: IPropOption | any) {
        if ((this as any).prototype.props_ == null) {
            (this as any).prototype.props_ = {};
        }
        (this as any).prototype.props_ = option;
    }

    watch(propName: string, cb: (newValue, oldValue) => void) {
        if (this.watchList_[propName] == null) {
            this.watchList_[propName] = [];
        }
        this.watchList_[propName].push(cb);
    }

    set(target, prop, valueToSet) {
        setAndReact(target, prop, valueToSet);
    }

    delete(target, prop) {
        deleteAndReact(target, prop);
    }

    render: () => void;

    private createTextNode_(value, propDependency) {
        const el = document.createTextNode(value);
        // if (propDependency) {
        //     this.storeDependency_(propDependency, el);
        // }
        return el;
    }

    private createCommentNode_() {
        return document.createComment("");
    }

    private updateDOM_(key: string, oldValue) {

        for (const prop in this.dependency_) {
            if (prop === key) {
                const depItems = this.dependency_[prop];
                depItems.forEach(item => {
                    switch (item.nodeType) {
                        // Text Node
                        case 3:
                            item.nodeValue = this.resolve_(key); break;
                        // Input node 
                        case 1:
                            (item as HTMLInputElement).value = this.resolve_(key)
                            break;
                        default:
                            if (item.ifExp) {
                                const el = item.method();
                                (item.el as HTMLElement).parentNode.replaceChild(
                                    el, item.el
                                )
                                item.el = el;
                            }
                            else if (item.forExp) {
                                const resolvedValue = this.resolve_(key);
                                const ref: HTMLDivElement = item.ref;
                                const els = this.runForExp_(key, resolvedValue, item.method);
                                const parent = ref.parentNode;
                                // remove all nodes
                                for (let i = 0, len = getObjectLength(oldValue); i < len; i++) {
                                    parent.removeChild(ref.nextSibling);
                                }

                                if (isArray(resolvedValue)) {
                                    new Observer(resolvedValue).createForArray((arrayProp, params) => {
                                        this.onObjModified_(key, arrayProp, params);
                                    })
                                    resolvedValue.forEach((value, index) => {
                                        this.onObjModified_(key, "push", {
                                            value: value,
                                            key: index,
                                            length: index + 1
                                        })
                                    })
                                }
                                else {
                                    new Observer(resolvedValue).create((objectProp, oldValue, newValue) => {
                                        this.onObjModified_(key, objectProp, oldValue);
                                    })
                                    let index = 0;
                                    for (let prop in resolvedValue) {
                                        if (resolvedValue.hasOwnProperty(prop)) {
                                            index++;
                                            this.onObjModified_(key, "push", {
                                                value: resolvedValue[prop],
                                                key: prop,
                                                length: index + 1
                                            })
                                        }
                                    }
                                }
                            }
                    }
                });
                return;
            }
        }
    }

    private handleExp_(method: Function, keys: string[], id: string) {
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

    private dependency_: { [key: string]: any[] } = {};

    private attachGetterSetter_() {
        new Observer(this).create((key, oldValue, newValue) => {
            if (this.watchList_[key] != null) {
                this.watchList_[key].forEach(cb => {
                    cb(newValue, oldValue);
                })
            }
            this.updateDOM_(key, oldValue);
        }, (key) => {
            if (isObject(this[key]) === false) {
                return;
            }
            if (isArray(this[key])) {
                new Observer(this[key]).createForArray((arrayProp, params) => {
                    this.onObjModified_(key, arrayProp, params);
                })
            }
            else {
                new Observer(this[key]).create((objectProp, oldValue, newValue) => {
                    this.onObjModified_(key, objectProp, oldValue);
                })
            }
        }, this.reactives_ || []);
    }

    private onObjModified_(key: string, prop, params) {
        console.log("onObjModified", key, prop, params);
        if (this.dependency_[key]) {
            this.dependency_[key].filter(q => q.forExp === true).forEach(item => {
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
                        if (params[2]) {
                            var newElement = item.method(params[2], params[0]);
                            (parent as HTMLElement).insertBefore(newElement, parent.childNodes[indexOfRef + 1 + params[0]]);
                        }
                        break;
                    default:
                        // if(isObject())
                        const resolvedValue = this.resolve_(key)
                        const index = Object.keys(resolvedValue).findIndex(q => q === prop);
                        if (index >= 0) {
                            var newElement = item.method(resolvedValue[prop], prop);
                            parent.replaceChild(newElement, parent.childNodes[indexOfRef + 1 + index]);
                        }
                }
            });
            // console.log("value", values);
            // return;
        }
    }

    private runForExp_(key, value, method) {
        const els: any[] = [];
        if (process.env.NODE_ENV !== 'production') {
            if (isPrimitive(value) || isNull(value)) {
                new LogHelper(ERROR_TYPE.ForOnPrimitiveOrNull, key).throwPlain();
            }
        }

        if (isArray(value)) {
            value.map((item, i) => {
                els.push(method(item, i));
            });
        }
        else if (isObject(value)) {
            for (let prop in value) {
                els.push(method(value[prop], prop));
            }
        }
        return els;
    }

    private handleForExp_(key, method: Function, id: string) {
        const cmNode = this.createCommentNode_();
        let els = [cmNode];
        const resolvedValue = this.resolve_(key);

        els = els.concat(this.runForExp_(key, resolvedValue, method));

        nextTick(() => {
            this.storeDependency_(key, {
                forExp: true,
                method: method,
                ref: cmNode,
                id: id
            });
            new MutationObserver((mutationsList, observer) => {
                if (document.body.contains(cmNode) === false) {
                    observer.disconnect();
                    const depIndex = this.dependency_[key].findIndex(q => q.id === id);
                    this.dependency_[key].splice(depIndex, 1);
                }
            }).observe(this.element, { childList: true, subtree: true });
        });
        return els;
    }

    private resolve_(path) {
        var properties = Array.isArray(path) ? path : path.split(".")
        return properties.reduce((prev, curr) => prev && prev[curr], this)
    }

    private storeDependency_(key: string, value) {
        // if (this[key] == null) {
        //     return;
        // }
        if (this.dependency_[key] == null) {
            this.dependency_[key] = [value];
        }
        else if (this.dependency_[key].findIndex(q => q.id === value.id) < 0) {
            this.dependency_[key].push(value);
        }
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

    off(event: string, cb: Function) {
        if (this.events_[event]) {
            if (cb) {
                const index = this.events_[event].indexOf(cb);
                this.events_[event].splice(index, 1);
            }
            else {
                this.events_[event] = [];
            }
        }
    }

    emit(event: string, data?: any) {
        if (this.events_[event]) {
            this.events_[event].forEach(cb => {
                cb(data);
            })
        }
    }

    private createElement_(tag, childs: HTMLElement[], option) {
        if (tag == null) {
            return this.createCommentNode_();
        }
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
                    if (attr.hasOwnProperty(key)) {
                        element.setAttribute(key, attr[key].v);
                    }
                }
            }

            if (option.on) {
                const events = option.on;
                for (const eventName in events) {
                    if (events[eventName]) {
                        element['on' + eventName] = events[eventName].bind(this);
                    }
                    else {
                        new LogHelper(ERROR_TYPE.InvalidEventHandler, {
                            eventName,
                        }).logPlainError();
                    }
                }
            }

            if (option.dir) {
                const dir = option.dir;
                element.dirId = unique();
                for (const name in dir) {
                    const storedDirective = globalDirectives[name]
                    if (storedDirective != null) {
                        const input = dir[name];
                        const merge = function (obj1, obj2) {
                            obj1 = Object.assign({}, obj1);
                            return Object.assign(obj1, obj2);
                        }
                        const directive = merge(genericDirective, storedDirective(element, {
                            args: "",
                            input: input,
                            modifiers: {}
                        } as IDirectiveBinding, this));
                        directive.created(this.resolve_(input));
                        nextTick(() => {
                            this.watch(input, directive.valueUpdated);
                            this.directiveDep_[element.dirId] = element;
                            directive.inserted();
                        })
                    }
                }
            }
        }
        else if (this.children[tag] || globalComponents[tag]) {
            const component: Component = new (this.children[tag] || globalComponents[tag] as any)();
            const htmlAttributes = this.initComponent_(component as any, option);
            element = component.element = component.executeRender_();
            htmlAttributes.forEach(item => {
                element.setAttribute(item.key, item.value);
            })
        }
        else {
            new LogHelper(ERROR_TYPE.InvalidComponent, {
                tag: tag
            }).throwPlain();

        }

        if (option.dep) {
            option.dep.forEach(item => {
                this.storeDependency_(item, element);
            });
        }
        return element;

    }

    find(selector: string) {
        return this.element.querySelector(selector);
    }

    findAll(selector: string) {
        return this.element.querySelectorAll(selector);
    }

    rendered() {
    }

    created() {
    }

    destroyed() {
    }

    filter(name: string, value) {
        if (globalFilters[name]) {
            return globalFilters[name](value);
        }
        else if (this.filters_[name]) {
            return this.filters_[name](value);
        }
        new LogHelper(ERROR_TYPE.InvalidFilter, {
            filter: name
        }).throwPlain();
    }


    private initComponent_(component: this, option) {
        if (component._$storeGetters) {
            // can not make it async because if item is array then it will break
            // because at that time value will be undefined
            // so set it before rendering
            component._$storeGetters.forEach(item => {
                component[item.prop] = component.$store.state[item.state];
                const cb = (newValue, oldValue) => {
                    component[item.prop] = newValue;
                    component.updateDOM_(item.prop, oldValue);
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
                if (component.props_[key]) {
                    component[key] = value.v;
                    this.watch(value.k, (newValue, oldValue) => {
                        component[key] = newValue;
                        component.updateDOM_(key, oldValue);
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
        return htmlAttributes;
    }

    private clearAll_() {
        this._$storeWatchCb.forEach(item => {
            this.$store.unwatch(item.key, item.cb)
        });
        this.events_ = {};
        this.watchList_ = {};
        this.directiveDep_ = {};
        this.emit(LIFECYCLE_EVENT.Destroyed);
    }

    private executeRender_() {
        const renderFn = this.render || ParserUtil.createRenderer(this.template);
        console.log("renderer", renderFn);
        this.element = renderFn.call(this,
            this.createElement_.bind(this),
            this.createTextNode_,
            this.filter.bind(this),
            this.handleExp_.bind(this),
            this.handleForExp_.bind(this)
        );
        nextTick(() => {
            new MutationObserver((mutationsList, observer) => {
                console.log("mutationsList", mutationsList);
                if (document.body.contains(this.element) === false) {
                    observer.disconnect();
                    this.clearAll_();
                }
            }).observe(document.body, { childList: true, subtree: true });
            if ((this as any).$store) {
                for (let key in this.dependency_) {
                    if (key.indexOf("$store.state") >= 0) {
                        const cb = (newValue, oldValue) => {
                            this.updateDOM_(key, oldValue);
                        };
                        key = key.replace("$store.state.", '');
                        (this as any).$store.watch(key, cb);
                        this._$storeWatchCb.push({
                            key, cb
                        });
                    }
                }
            }
            this.emit(LIFECYCLE_EVENT.Rendered);
        })
        return this.element;
    }

    private directives_;

    private filters_;
    private props_;
    private reactives_;

    private watchList_: {
        [key: string]: Array<(newValue, oldValue) => void>
    } = {};

    private _$storeWatchCb: { key: string, cb: Function }[] = [];

    private _$storeGetters: { prop: string, state: string }[];

    private directiveDep_ = {};

}
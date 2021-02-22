import { createRenderer } from "../helpers";
import { HTML_TAG, ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { setAndReact, Observer, deleteAndReact, createTextNode, createCommentNode, runPromisesInSequence } from "../helpers";
import { IPropOption, ITajStore, IDirectiveBinding, IAttrItem, IDirective } from "../interface";
import { globalFormatter, globalComponents, globalDirectives, defaultSlotName } from "../constant";
import { isArray, isObject, isPrimitive, nextTick, LogHelper, isNull, getObjectLength, merge, setAttribute, forOwn, indexOf, isKeyExist, getDataype, EventBus } from "../utils";
import { genericDirective } from "../generics";

export abstract class Component {
    children: { [key: string]: typeof Component };
    element: HTMLElement;
    template: string;
    $store: ITajStore;

    constructor() {
        nextTick(() => {
            this.attachGetterSetter_();
            this.emit(LIFECYCLE_EVENT.Created);
        });
        if (isNull(this.children)) {
            this.children = {};
        }
        if (isNull(this.formatters_)) {
            this.formatters_ = {};
        }
        if (isNull(this.directive_)) {
            this.directive_ = {};
        }
        if (isNull(this.props_)) {
            this.props_ = {};
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
        return this;
    }

    unwatch(propName: string, cb: (newValue, oldValue) => void) {
        if (this.watchList_[propName] != null) {
            const index = this.watchList_[propName].indexOf(cb);
            if (index >= 0) {
                this.watchList_[propName].splice(index, 1);
            }
        }
        return this;
    }

    set(target, prop, valueToSet) {
        setAndReact(target, prop, valueToSet);
    }

    delete(target, prop) {
        deleteAndReact(target, prop);
    }

    render: () => void;

    on(event: string, cb: Function) {
        this.eventBus_.on(event, cb);
        return this;
    }

    off(event: string, cb: Function) {
        this.eventBus_.off(event, cb);
    }

    emit(event: string, data?: any) {
        this.eventBus_.emit(event, data);
    }

    find(selector: string) {
        return this.element.querySelector(selector);
    }

    findAll(selector: string) {
        return this.element.querySelectorAll(selector);
    }

    format(formatterName: string, value) {
        if (globalFormatter[formatterName]) {
            return globalFormatter[formatterName](value);
        }
        else if (this.formatters_[formatterName]) {
            return this.formatters_[formatterName](value);
        }
        new LogHelper(ERROR_TYPE.InvalidFormatter, {
            formatter: formatterName
        }).throwPlain();
    }

    private handleForExp_(key, method: Function, id: string) {
        let cmNode = createCommentNode();
        let els = [cmNode];
        let resolvedValue = this.resolve_(key);
        els = els.concat(this.runForExp_(key, resolvedValue, method));
        nextTick(() => {

            let callBacks = {
                [key]: (newValue, oldValue) => {
                    // value resetted
                    this.runForExp_(key, newValue, method);
                    const parent = cmNode.parentNode;
                    // remove all nodes

                    // for (let i = 0, len = getObjectLength(oldValue); i < len; i++) {
                    //     parent.removeChild(cmNode.nextSibling);
                    // }
                    let nextSibling = cmNode.nextSibling;
                    while (nextSibling != null) {
                        parent.removeChild(nextSibling);
                        nextSibling = cmNode.nextSibling;
                    }

                    // add all node
                    if (isArray(newValue)) {
                        newValue.forEach((item, index) => {
                            handleChange("push", {
                                value: item,
                                key: index,
                                length: index + 1
                            });
                        });
                    }
                    else {
                        let index = 0;
                        forOwn(newValue, (prop, value) => {
                            index++;
                            handleChange("push", {
                                value,
                                key: prop,
                                length: index + 1
                            });
                        });
                    }
                    //add setter
                    if (isObject(newValue)) {
                        this.observer_.create(newValue, null, `${key}.`);
                    }
                },
                [`${key}.push`]: (newValue, oldValue) => {
                    handleChange("push", oldValue);
                },
                [`${key}.splice`]: (newValue, oldValue) => {
                    handleChange("splice", oldValue);
                },
                [`${key}.update`]: (newValue, oldValue) => {
                    handleChange("update", oldValue);
                }
            };
            const onElDestroyed = () => {
                cmNode.removeEventListener(LIFECYCLE_EVENT.Destroyed, onElDestroyed);
                cmNode = null;
                for (const ev in callBacks) {
                    this.unwatch(ev, callBacks[ev]);
                }
                callBacks = null;
            };
            cmNode.addEventListener(LIFECYCLE_EVENT.Destroyed, onElDestroyed);
            const handleChange = (prop, params) => {
                const parent = cmNode.parentNode;
                const indexOfRef = Array.prototype.indexOf.call(parent.childNodes, cmNode);
                let newElement;
                switch (prop) {
                    case 'push':
                        newElement = method(params.value, params.key);
                        parent.insertBefore(newElement, parent.childNodes[indexOfRef + params.length]);
                        break;
                    case 'splice':
                        for (let i = 1; i <= params[1]; i++) {
                            parent.removeChild(parent.childNodes[indexOfRef + params[0] + i]);
                        }
                        if (params[2]) {
                            newElement = method(params[2], params[0]);
                            parent.insertBefore(newElement, parent.childNodes[indexOfRef + 1 + params[0]]);
                        }
                        break;
                    case 'update':
                        resolvedValue = this.resolve_(key);
                        const index = indexOf(resolvedValue, params[0]);
                        if (index >= 0) {
                            newElement = method(params[1], params[0]);
                            parent.replaceChild(newElement, parent.childNodes[indexOfRef + 1 + index]);
                        }
                        break;
                }
            };
            this.watch(key, callBacks[key]).
                watch(`${key}.push`, callBacks[`${key}.push`]).
                watch(`${key}.splice`, callBacks[`${key}.splice`]).
                watch(`${key}.update`, callBacks[`${key}.update`]);
        });
        return els;
    }

    private resolve_(path) {
        const properties = Array.isArray(path) ? path : path.split(".");
        return properties.reduce((prev, curr) => prev && prev[curr], this);
    }

    private eventBus_ = new EventBus();

    private handleDirective_(element, dir, isComponent) {
        if (dir) {
            forOwn(dir, (name, compiledDir) => {
                const storedDirective = this.directive_[name] || globalDirectives[name];
                if (storedDirective != null) {
                    const binding = {
                        input: compiledDir.input,
                        params: compiledDir.params,
                        isComponent: isComponent,
                        props: compiledDir.props,
                        value: compiledDir.value()
                    } as IDirectiveBinding;
                    const directive: IDirective = merge(genericDirective,
                        storedDirective.call(this, element, binding));
                    nextTick(() => {
                        const onDestroyed = () => {
                            directive.destroyed();
                            if (!isComponent) {
                                element.removeEventListener(LIFECYCLE_EVENT.Destroyed, onDestroyed);
                            }
                            element = null;
                        };
                        if (isComponent) {
                            (element as Component).on(LIFECYCLE_EVENT.Destroyed, onDestroyed);
                        }
                        else {
                            element.addEventListener(LIFECYCLE_EVENT.Destroyed, onDestroyed);
                        }
                        compiledDir.props.forEach((prop) => {
                            this.watch(prop, () => {
                                binding.value = compiledDir.value();
                                directive.valueUpdated();
                            });
                        });
                        directive.inserted();
                    });
                }
            });
        }
    }

    private createElement_(tag, childs: HTMLElement[], option) {
        if (tag == null) {
            return createCommentNode();
        }
        let element;
        let component: Component;
        if (HTML_TAG[tag]) {
            switch (tag) {
                case "slot":
                case "target":
                    if (!option.attr) {
                        option.attr = {};
                    }
                    if (!option.attr.name) {
                        option.attr.name = {
                            v: defaultSlotName
                        };
                    }
            }

            element = document.createElement(tag) as HTMLElement;
            childs.forEach((item) => {
                element.appendChild(item);
            });

            if (option.html) {
                (element as HTMLElement).innerHTML = option.html;
            }

            if (option.attr) {
                forOwn(option.attr, (key, attrItem) => {
                    setAttribute(element, key, attrItem.v);
                    if (attrItem.k != null) {
                        this.watch(attrItem.k, (newValue) => {
                            setAttribute(element, key, newValue);
                        });
                    }
                });
            }

            if (option.on) {
                const evListener = {};
                const events = option.on;
                for (const eventName in events) {
                    const ev = events[eventName];
                    const methods = [];
                    ev.modifiers.forEach(item => {
                        switch (item) {
                            case 'prevent':
                                methods.push((e) => {
                                    e.preventDefault();
                                    return e;
                                }); break;
                            case 'stop':
                                methods.push((e) => {
                                    e.stopPropagation();
                                    return e;
                                }); break;
                        }
                    });
                    ev.handlers.forEach(item => {
                        if (item != null) {
                            methods.push(item.bind(this));
                        }
                        else {
                            new LogHelper(ERROR_TYPE.InvalidEventHandler, {
                                eventName,
                            }).logPlainError();
                        }
                    });
                    if (eventName === "input" && ev.isNative === false) {
                        methods.unshift((e) => {
                            return e.target.value;
                        });
                    }
                    evListener[eventName] = methods.length > 1 ?
                        (e) => {
                            runPromisesInSequence(methods, e);
                        } :
                        (e) => {
                            methods[0].call(this, e);
                        };

                    (element as HTMLDivElement).addEventListener(
                        eventName, evListener[eventName],
                        {
                            capture: isKeyExist(ev.option, 'capture'),
                            once: isKeyExist(ev.option, 'once'),
                            passive: isKeyExist(ev.option, 'passive'),
                        }
                    );
                }

                const onElDestroyed = () => {
                    element.removeEventListener(LIFECYCLE_EVENT.Destroyed, onElDestroyed);
                    for (const ev in evListener) {
                        element.removeEventListener(ev, evListener[ev]);
                    }
                };
                element.addEventListener(LIFECYCLE_EVENT.Destroyed, onElDestroyed);
            }

            this.handleDirective_(element, option.dir, false);

        }
        else if (this.children[tag] || globalComponents[tag]) {
            component = new (this.children[tag] || globalComponents[tag] as any)();
            const htmlAttributes = this.initComponent_(component as any, option);
            element = component.element = component.executeRender_();
            childs.forEach(item => {
                if (item.tagName === "TARGET") {
                    const targetSlot =
                        component.find(`slot[name='${item.getAttribute("name")}']`);
                    if (targetSlot) {
                        const targetSlotParent = targetSlot.parentElement;
                        item.childNodes.forEach(child => {
                            targetSlotParent.insertBefore(child, targetSlot.nextSibling);
                        });
                        targetSlot.parentElement.removeChild(targetSlot);
                    }
                }
            });
            (htmlAttributes || []).forEach(item => {
                element.setAttribute(item.key, item.value);
            });
        }
        else {
            new LogHelper(ERROR_TYPE.InvalidComponent, {
                tag: tag
            }).throwPlain();
        }
        return element;

    }


    private updateDOM_(key: string, oldValue) {

        const depItems = this.dependency_[key];
        if (depItems == null) {
            return;
        }
        depItems.forEach(item => {
            switch (item.nodeType) {
                // Text Node
                case 3:
                    item.nodeValue = this.resolve_(key); break;
                // Input node 
                case 1:
                    (item as HTMLInputElement).value = this.resolve_(key);
                    break;
                default:
                    if (item.ifExp) {
                        const el = item.method();
                        (item.el as HTMLElement).parentNode.replaceChild(
                            el, item.el
                        );
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
                    }
            }
        });
    }

    private handleExp_(method: Function, keys: string[], id?: string) {
        let el = method();
        const handleChange = () => {
            const watchCallBack = () => {
                const newEl = method();
                el.parentNode.replaceChild(
                    newEl, el
                );
                // nextTick(() => {
                el = newEl;
                handleChange();
                // })
            };
            keys.forEach(item => {
                this.watch(item, watchCallBack);
            });
            const onElDestroyed = function () {
                el.removeEventListener(LIFECYCLE_EVENT.Destroyed, onElDestroyed);
                keys.forEach(item => {
                    this.unwatch(item, watchCallBack);
                });
            }.bind(this);
            el.addEventListener(LIFECYCLE_EVENT.Destroyed, onElDestroyed);
        };
        nextTick(() => {
            handleChange();
        });
        return el;
    }

    private dependency_: { [key: string]: any[] } = {};

    private observer_: Observer;

    private attachGetterSetter_() {
        this.observer_ = new Observer();
        this.observer_.onChange = this.onChange_.bind(this);
        this.observer_.create(this, this.reactives_ || []);
    }

    private onChange_(key, oldValue, newValue) {
        if (this.watchList_[key] != null) {
            this.watchList_[key].forEach(cb => {
                cb(newValue, oldValue);
            });
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
            for (const prop in value) {
                els.push(method(value[prop], prop));
            }
        }
        return els;
    }

    private initComponent_(component: Component, option) {
        if (component.storeGetters_) {
            // can not make it async because if item is array then it will break
            // because at that time value will be undefined
            // so set it before rendering
            component.storeGetters_.forEach(item => {
                component[item.prop] = component.$store.state[item.state];
                const cb = (newValue, oldValue) => {
                    component[item.prop] = newValue;
                    component.updateDOM_(item.prop, oldValue);
                };
                component.$store.watch(item.state, cb);
                component.storeWatchCb_.push({
                    key: item.state,
                    cb
                });
            });
        }

        const htmlAttributes = [];
        if (option.attr) {
            const attr = option.attr;
            for (const key in attr) {
                const value: IAttrItem = attr[key];
                if (component.props_[key]) {
                    const setPropValue = () => {
                        component[key] = value.v;
                        if (process.env.NODE_ENV !== "test") {
                            this.watch(value.k, (newValue, oldValue) => {
                                component[key] = newValue;
                                component.onChange_(key, oldValue, newValue);
                            });
                        }
                    };
                    if (component.props_[key].type) {
                        const expected = component.props_[key].type;
                        const received = getDataype(value.v);
                        if (expected === received) {
                            setPropValue();
                        }
                        else {
                            new LogHelper(ERROR_TYPE.PropDataTypeMismatch,
                                {
                                    prop: key,
                                    exp: expected,
                                    got: received,
                                    template: this.template,
                                    file: this.file_
                                }).throwPlain();
                        }
                    }
                    else {
                        setPropValue();
                    }
                }
                else {
                    htmlAttributes.push({
                        key,
                        value: value.v
                    });
                }
            }
        }
        if (option.on) {
            const events = option.on;
            for (const eventName in events) {
                const ev = events[eventName];
                const methods = [];
                ev.handlers.forEach(item => {
                    if (item != null) {
                        methods.push(item.bind(this));
                    }
                    else {
                        new LogHelper(ERROR_TYPE.InvalidEventHandler, {
                            eventName,
                        }).logPlainError();
                    }
                });
                component.on(eventName, (args) => {
                    runPromisesInSequence(methods, args);
                });
            }
        }
        this.handleDirective_(component, option.dir, true);
        component.on(LIFECYCLE_EVENT.Destroyed, () => {
            component = null;
        });
        return htmlAttributes;
    }

    private clearAll_ = () => {
        // need to emit before clearing events
        this.emit(LIFECYCLE_EVENT.Destroyed);
        this.element.removeEventListener(LIFECYCLE_EVENT.Destroyed, this.clearAll_);
        this.storeWatchCb_.forEach(item => {
            this.$store.unwatch(item.key, item.cb);
        });
        this.eventBus_.destroy();
        this.element = this.eventBus_ =
            this.observer_ =
            this.storeWatchCb_ = null;
        this.dependency_ = {};
        this.watchList_ = {};
    }

    private executeRender_() {
        const renderFn = this.render || createRenderer(this.template);
        this.element = renderFn.call(this,
            this.createElement_.bind(this),
            createTextNode,
            this.format.bind(this),
            this.handleExp_.bind(this),
            this.handleForExp_.bind(this)
        );
        nextTick(() => {
            if ((this as any).$store) {
                for (let key in this.dependency_) {
                    if (key.indexOf("$store.state") >= 0) {
                        const cb = (newValue, oldValue) => {
                            this.updateDOM_(key, oldValue);
                        };
                        key = key.replace("$store.state.", '');
                        (this as any).$store.watch(key, cb);
                        this.storeWatchCb_.push({
                            key, cb
                        });
                    }
                }
            }
            this.element.addEventListener(LIFECYCLE_EVENT.Destroyed, this.clearAll_);
            this.emit(LIFECYCLE_EVENT.Rendered);
        });
        return this.element;
    }

    private directive_;

    private formatters_;
    private props_;
    private reactives_;

    private watchList_: {
        [key: string]: Array<(newValue, oldValue) => void>
    } = {};

    private storeWatchCb_: Array<{ key: string, cb: Function }> = [];

    private storeGetters_: Array<{ prop: string, state: string }>;

    private file_;
}
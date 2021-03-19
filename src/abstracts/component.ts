import { HTML_TAG, ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { setAndReact, Observer, deleteAndReact, createCommentNode, runPromisesInSequence, getReplacedBy, handleAttribute, handleDirective } from "../helpers";
import { IPropOption, ITajStore, } from "../interface";
import { globalFormatter, globalComponents, defaultSlotName } from "../constant";
import { isArray, nextTick, Logger, isNull, initComponent, setAttribute, isKeyExist, EventBus, getAttribute, replaceEl, executeRender } from "../utils";

const renderEvent = new window.CustomEvent(LIFECYCLE_EVENT.Rendered);

export interface Component {
    render?(createElement, createTextNode, format, handleExpression, handleForExp): HTMLElement;
}
export abstract class Component {
    children: { [key: string]: typeof Component };
    element: HTMLElement;
    template: string;
    $store: ITajStore;

    constructor() {
        nextTick(() => {
            this.attachGetterSetter_();
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

    on(event: string, cb: Function) {
        this.eventBus_.on(event, cb);
        return this;
    }

    off(event: string, cb: Function) {
        this.eventBus_.off(event, cb);
    }

    emit(event: string, ...args) {
        return this.eventBus_.emit(event, ...args);
    }

    find(selector: string) {
        return this.element.querySelector(selector);
    }

    findAll(selector: string) {
        return this.element.querySelectorAll(selector);
    }

    get outerHTML() {
        return this.element.outerHTML;
    }

    format(formatterName: string, value) {
        if (globalFormatter[formatterName]) {
            return globalFormatter[formatterName](value);
        }
        else if (this.formatters_[formatterName]) {
            return this.formatters_[formatterName](value);
        }
        new Logger(ERROR_TYPE.InvalidFormatter, {
            formatter: formatterName
        }).throwPlain();
    }

    resolve(path) {
        const properties = isArray(path) ? path : path.split(".");
        return properties.reduce((prev, curr) => prev && prev[curr], this);
    }

    private eventBus_ = new EventBus(this);



    emitRender_(element: HTMLElement) {
        nextTick(() => {
            element.dispatchEvent(renderEvent);
        })
    }

    private createElement_(tag: string, childs: HTMLElement[], option) {
        let element;
        if (tag == null) {
            element = createCommentNode();
            this.emitRender_(element);
            return element;
        }
        if (!option.attr) {
            option.attr = {};
        }
        if (HTML_TAG[tag]) {
            switch (tag) {
                case "slot":
                case "target":
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

            handleAttribute.call(this, element, option.attr, false);

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
                            new Logger(ERROR_TYPE.InvalidEventHandler, {
                                ev: eventName,
                            }).throwPlain();
                        }
                    });
                    if (eventName === "input" && !ev.isNative) {
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

            handleDirective.call(this, element, option.dir, false);
            this.emitRender_(element);
            return element;
        }
        const savedComponent = this.children[tag] || globalComponents[tag];
        if (savedComponent) {
            element = createCommentNode(tag);
            new Promise(res => {
                if (savedComponent instanceof Promise) {
                    savedComponent.then(comp => {
                        res(comp.default);
                    })
                }
                else {
                    res(savedComponent);
                }
            }).then((comp: any) => {
                const component: Component = new comp();
                const htmlAttributes = initComponent.call(this, component as any, option);
                component.element = executeRender.call(component, childs);
                replaceEl(element, component.element);
                const cm = element;
                element = component.element;
                let targetSlot = component.find(`slot[name='default']`);
                if (targetSlot) {
                    childs.forEach(item => {
                        if (item.tagName === "TARGET") {
                            const namedSlot = component.find(`slot[name='${item.getAttribute("name")}']`);
                            if (namedSlot) {
                                targetSlot = namedSlot;
                            }
                        }
                        const targetSlotParent = targetSlot.parentElement;
                        if (item.nodeType === 3) {
                            targetSlotParent.insertBefore(item, targetSlot.nextSibling);
                        }
                        else {
                            item.childNodes.forEach(child => {
                                targetSlotParent.insertBefore(child, targetSlot.nextSibling);
                            });
                        }
                        targetSlotParent.removeChild(targetSlot);
                    });
                }

                (htmlAttributes || []).forEach(item => {
                    switch (item.key) {
                        case 'class':
                            item.value = (getAttribute(element, item.key) || '') + ' ' + item.value;
                            break;
                        case 'style':
                            item.value = (getAttribute(element, item.key) || '') + item.value;
                    }
                    setAttribute(element, item.key, item.value);
                });
                nextTick(() => {
                    cm.replacedBy = element;
                    this.emitRender_(cm);
                })
            })
            return element;
        }
        else if (tag === "in-place") {
            return this.handleInPlace_(childs, option);
        }
        else {
            new Logger(ERROR_TYPE.InvalidComponent, {
                tag: tag
            }).throwPlain();
        }
        return element;
    }

    private inPlaceWatchers = {};

    private handleInPlace_(childs, option) {
        const attr = option.attr.of;
        if (!attr) return createCommentNode();
        delete option.attr.of;
        let el: HTMLElement = this.createElement_(attr.v, childs, option);
        const key = attr.k;
        if (key) {
            const watchCallBack = (val) => {
                const newEl = this.createElement_(val, childs, option);
                replaceEl(el, newEl);
                el = newEl;
                checkForRendered();
            };
            const checkForRendered = () => {
                const onElementRendered = () => {
                    el.removeEventListener(LIFECYCLE_EVENT.Rendered, onElementRendered);
                    el = getReplacedBy(el);
                }
                el.addEventListener(LIFECYCLE_EVENT.Rendered, onElementRendered);
            };
            checkForRendered();
            if (!this.inPlaceWatchers[key]) {
                this.watch(key, watchCallBack);
                this.inPlaceWatchers[key] = true;
            }
        }
        return el;
    }


    // private updateDOM_(key: string, oldValue) {

    //     const depItems = this.dependency_[key];
    //     if (depItems == null) {
    //         return;
    //     }
    //     depItems.forEach(item => {
    //         switch (item.nodeType) {
    //             // Text Node
    //             case 3:
    //                 item.nodeValue = this.resolve(key); break;
    //             // Input node 
    //             case 1:
    //                 (item as HTMLInputElement).value = this.resolve(key);
    //                 break;
    //             default:
    //                 if (item.ifExp) {
    //                     const el = item.method();
    //                     (item.el as HTMLElement).parentNode.replaceChild(
    //                         el, item.el
    //                     );
    //                     item.el = el;
    //                 }
    //                 else if (item.forExp) {
    //                     const resolvedValue = this.resolve(key);
    //                     const ref: HTMLDivElement = item.ref;
    //                     const els = this.runForExp_(key, resolvedValue, item.method);
    //                     const parent = ref.parentNode;
    //                     // remove all nodes
    //                     for (let i = 0, len = getObjectLength(oldValue); i < len; i++) {
    //                         parent.removeChild(ref.nextSibling);
    //                     }
    //                 }
    //         }
    //     });
    // }


    private dependency_: { [key: string]: any[] } = {};

    private observer_: Observer;

    private attachGetterSetter_() {
        this.observer_ = new Observer();
        this.observer_.onChange = this.onChange_.bind(this);
        this.observer_.create(this, Object.keys(this.props_).concat(this.reactives_ || []));
    }

    private onChange_(key, oldValue, newValue) {
        if (this.watchList_[key] != null) {
            this.watchList_[key].forEach(cb => {
                cb.call(this, newValue, oldValue);
            });
        }
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
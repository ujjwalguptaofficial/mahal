import { ERROR_TYPE } from "../enums";
import { Observer, Logger, indexOf, emitError } from "../helpers";
import { IAttrItem, IElementOption, ILazyComponent, IRenderContext, } from "../interface";
import { EventBus, emitStateChange, resolveValue, replaceNullProp, getDataype, initComponent } from "../utils";
import { Mahal } from "../mahal";
import { emptyObj } from "../constant";
import { TYPE_ALL_LIFE_CYCLE_EVENT, TYPE_EVENT_STORE } from "../types";

export abstract class Component<GLOBAL_TYPE = { [key: string]: any }> {

    /**
     * children components
     *
     * @type {({ [key: string]: typeof Component | ILazyComponent })}
     * @memberof Component
     */
    children: { [key: string]: typeof Component | ILazyComponent };

    /**
     * contains component mounted dom element
     *
     * @type {HTMLElement}
     * @memberof Component
     */
    element: HTMLElement;



    /**
     * contains html - is used when render method is not present
     *      
     * @type {string}
     * @memberof Component
     */
    template: string;

    /**
     * Boolean value - true if component mounted
     *
     * @memberof Component
     */
    isMounted = false;

    constructor() {
        const ctx = this;
        const getValue = () => emptyObj;
        replaceNullProp(ctx, 'children', getValue);
        replaceNullProp(ctx, '_formatters_', getValue);
        replaceNullProp(ctx, '_directive_', getValue);
        replaceNullProp(ctx, '_props_', getValue);
        replaceNullProp(ctx, '_computed_', getValue);
        replaceNullProp(ctx, '_reactives_', getValue);

        ctx._evBus_ = new EventBus(ctx._events_);
        ctx._watchBus_ = new EventBus(ctx._watchers_);
        ctx._childComps_ = new Set();
    }

    render?(context: IRenderContext): HTMLElement;

    /**
     * called just after the constructor - can be used to listen events
     * this is similar to constructor but `this` value is proxified
     *
     * @memberof Component
     */
    onInit() {

    }

    /**
     *  set state
     *
     * @param {string} key
     * @param {*} args
     * @return {*} 
     * @memberof Component
     */
    setState(key: string, ...args) {
        const splittedKey = key.split(".");
        const ctx = this;
        const emitChange = (propToEmit, value1, value2?) => {
            if (ctx._reactives_[key]) return;
            if (process.env.NODE_ENV !== "production") {
                const componentProps = ctx._props_;
                if (Component.shouldCheckProp && componentProps[key]) {
                    new Logger(ERROR_TYPE.MutatingProp, {
                        html: ctx.outerHTML,
                        key: key
                    }).logPlainError();
                }
            }
            emitStateChange.call(ctx, propToEmit, value1, value2);
        };
        const firstValue = args[0];
        let oldValue;
        if (splittedKey.length > 1) {
            const storedValue = ctx.getState(key);
            const prop = splittedKey.pop();
            const targetKey = splittedKey.join(".");
            const prefix = targetKey + ".";
            const target = ctx.getState(targetKey);
            if (getDataype(storedValue) === 'function') {
                const result = target[prop](...args);
                emitChange(
                    prefix + prop,
                    args
                );
            }
            else {
                oldValue = target && target[prop];
                target[prop] = firstValue;
                if (oldValue !== undefined) {
                    emitChange(`${prefix}update`, { key: prop, value: firstValue, oldValue });
                } else {
                    emitChange(`${prefix}add`, {
                        value: firstValue,
                        key: prop,
                    });
                }
            }
            return;
        }
        oldValue = ctx[key];
        ctx[key] = firstValue;
        emitChange(key, firstValue, oldValue);
    }

    deleteState(key) {
        const splittedKey = key.split(".");
        const prop = splittedKey.pop();
        const targetKey = splittedKey.join(".");
        const prefix = targetKey + ".";
        const target = this.getState(targetKey);
        const index = indexOf(target, prop);
        Reflect.deleteProperty(target, prop);
        emitStateChange.call(this, prefix + 'delete', { index, key: prop });
    }

    /**
     * subscribe to state changes
     *
     * @param {string} propName
     * @param {(newValue, oldValue) => void} cb
     * @return {*} 
     * @memberof Component
     */
    watch(propName: string, cb: (newValue, oldValue) => void) {
        return this._watchBus_.on(propName, cb);
    }

    /**
     * unsubscribe to state changes
     *
     * @param {string} propName
     * @param {(newValue, oldValue) => void} [cb]
     * @return {*} 
     * @memberof Component
     */
    unwatch(propName: string, eventListener: Function) {
        this._watchBus_.off(propName, eventListener);
    }

    /**
     * subscribe to events
     *
     * @param {string} event
     * @param {Function} cb
     * @return {*} 
     * @memberof Component
     */
    on(event: TYPE_ALL_LIFE_CYCLE_EVENT, cb: Function);
    on(event: string, cb: Function);
    on(event: any, cb: Function) {
        return this._evBus_.on(event, cb);
    }

    /**
     * unsubscribe to events
     *
     * @param {string} event
     * @param {Function} cb
     * @memberof Component
     */
    off(event: string, eventListener: Function) {
        this._evBus_.off(event, eventListener);
    }

    /**
     * wait for an event
     *
     * @template T
     * @param {string} eventName
     * @return {*} 
     * @memberof Component
     */
    waitFor<T>(eventName: TYPE_ALL_LIFE_CYCLE_EVENT)
    waitFor<T>(eventName: string)
    waitFor<T>(eventName: string): Promise<T> {
        let eventCallback: Function;
        return new Promise<T>((res) => {
            eventCallback = (result) => {
                (res as any)(result);
            };
            this.on(eventName, eventCallback);
        }).then(() => {
            this.off(eventName, eventCallback);
        }) as any;
    }

    /**
     * emit event to all listener at a time
     *
     * @param {string} event
     * @param {*} args
     * @return {*} 
     * @memberof Component
     */
    emit(event: string, ...args) {
        return this._evBus_.emit(event, ...args);
    }

    /**
     * linearly calls events - in case of async: wait for one's completion and then call next
     *
     * @param {string} event
     * @param {*} args
     * @return {*} 
     * @memberof Component
     */
    emitLinear(event: string, ...args) {
        return this._evBus_.emitLinear(event, ...args);
    }

    /**
     * find first child element using selector
     *
     * @param {string} selector
     * @return {*} 
     * @memberof Component
     */
    find(selector: string) {
        const element = this.element;
        // nodetype 8 is comment
        if (element.nodeType === 8) return;
        return element.querySelector<HTMLElement>(selector);
    }

    /**
     * find all child elements using selector
     *
     * @param {string} selector
     * @return {*} 
     * @memberof Component
     */
    findAll(selector: string) {
        return this.element.querySelectorAll<HTMLElement>(selector);
    }

    /**
     * returns outer html of component
     *
     * @readonly
     * @memberof Component
     */
    get outerHTML() {
        return this.element.outerHTML;
    }

    /**
     * call specified formatter and return result
     *
     * @param {string} formatterName
     * @param {*} value
     * @return {*} 
     * @memberof Component
     */
    format(formatterName: string, value) {
        const globalFormatter = this._app_['_formatter_'];
        try {
            const savedGlobalFormatter = globalFormatter[formatterName];
            if (savedGlobalFormatter) {
                return savedGlobalFormatter(value);
            }
            const localFormatters = this._formatters_;
            const savedFormatter = localFormatters[formatterName];
            if (savedFormatter) {
                return savedFormatter(value);
            }
        } catch (error) {
            return emitError.call(this, error, true);
        }
        new Logger(ERROR_TYPE.InvalidFormatter, {
            formatter: formatterName
        }).throwPlain();
    }

    /**
     * resolve a state by string path 
     * 
     * useful for nested object 
     * `e.g - this.resolve('user.name.first')`
     * 
     *
     * @param {*} path
     * @return {*} 
     * @memberof Component
     */
    getState(path) {
        return resolveValue(path, this);
    }

    /**
     * global application value
     *
     * @readonly
     * @memberof Component
     */
    get global() {
        return this._app_.global as GLOBAL_TYPE;
    }

    /**
     * used for events
     *
     * @private
     * @memberof Component
     */
    // tslint:disable-next-line
    private _evBus_: EventBus;

    /**
     * used for property watching
     *
     * @private
     * @memberof Component
     */
    // tslint:disable-next-line
    private _watchBus_: EventBus;

    // tslint:disable-next-line
    private _app_: Mahal;

    // tslint:disable-next-line
    private _ob_: Observer;

    // tslint:disable-next-line
    private _directive_;

    // tslint:disable-next-line
    private _formatters_;

    // tslint:disable-next-line
    private _props_;

    // tslint:disable-next-line
    private _reactives_: { [key: string]: boolean };

    // tslint:disable-next-line
    private _watchers_: TYPE_EVENT_STORE;

    // tslint:disable-next-line
    private _events_: TYPE_EVENT_STORE;

    private _childComps_: Set<Component>;

    // tslint:disable-next-line
    private __file__;

    // tslint:disable-next-line
    private _computed_;

    // tslint:disable-next-line
    private _timerId_;

    static shouldCheckProp = true;

    getMethod(methodName: string) {
        return this[methodName] as Function;
    }

    private _handleExp_: (method: () => HTMLElement, keys: string[], type?: string) => void;
    private _render_: () => () => HTMLElement;
    private _clearAll_: () => void;
    private _initComp_: typeof initComponent;
    private _handleAttr_: (component, isComponent, option: IElementOption) => IElementOption;
    private _handleDir_: (element: HTMLElement, dir, isComponent: boolean, addRc?: Function) => void;

}


import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { Observer, Logger, getArrayEmitResult } from "../helpers";
import { ILazyComponent, IRenderContext, } from "../interface";
import { isArray, isNull, EventBus, Timer, getObjectLength } from "../utils";
import { Mahal } from "../mahal";

// do not rename this, this has been done to merge Component
// // tslint:disable-next-line
// export interface Component {

// }

export abstract class Component {

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
        this.on(LIFECYCLE_EVENT.Create, () => {

        });
        if (isNull(this.children)) {
            this.children = {};
        }
        if (isNull(this.__formatters__)) {
            this.__formatters__ = {};
        }
        if (isNull(this.__directive__)) {
            this.__directive__ = {};
        }
        if (isNull(this.__props__)) {
            this.__props__ = {};
        }
        if (isNull(this.__computed__)) {
            this.__computed__ = {};
        }

    }

    render?(context: IRenderContext): Promise<HTMLElement>;

    /**
     * called just after the constructor - can be used to listen events
     *
     * @memberof Component
     */
    onInit() {

    }

    /**
     * set state
     *
     * @param {string} key
     * @param {*} args
     * @param {*} [oldValue]
     * @memberof Component
     */
    setState(key: string, ...args) {
        const splittedKey = key.split(".");
        const emitChange = this.__emitStateChange__.bind(this);
        // const values = ...args;
        const firstValue = args[0];
        if (splittedKey.length > 1) {
            const storedValue = this.resolve(key);
            const prop = splittedKey.pop();
            const targetKey = splittedKey.join(".");
            const prefix = targetKey + ".";
            const target = this.resolve(targetKey);
            if (typeof storedValue === "function") {
                const result = target[prop](...args);
                emitChange(
                    prefix + prop,
                    getArrayEmitResult.call(this, target, prop, args, result)
                );
            }
            else {
                const oldValue = target && target[prop];
                target[prop] = firstValue;
                emitChange(prefix + (prop as string), firstValue, oldValue);
            }
            return;
        }
        this[key] = firstValue;
        emitChange(key, firstValue, args[1]);
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
        this.__watchBus__.on(propName, cb);
        return this;
    }

    /**
     * unsubscribe to state changes
     *
     * @param {string} propName
     * @param {(newValue, oldValue) => void} [cb]
     * @return {*} 
     * @memberof Component
     */
    unwatch(propName: string, cb?: (newValue, oldValue) => void) {
        this.__watchBus__.off(propName, cb);
        return this;
    }

    /**
     * subscribe to events
     *
     * @param {string} event
     * @param {Function} cb
     * @return {*} 
     * @memberof Component
     */
    on(event: string, cb: Function) {
        this.__eventBus__.on(event, cb);
        return this;
    }

    /**
     * unsubscribe to events
     *
     * @param {string} event
     * @param {Function} cb
     * @memberof Component
     */
    off(event: string, cb: Function) {
        this.__eventBus__.off(event, cb);
    }

    /**
     * wait for an event
     *
     * @template T
     * @param {string} eventName
     * @return {*} 
     * @memberof Component
     */
    waitFor<T>(eventName: string) {
        let eventCallback: Function;
        return new Promise<T>((res) => {
            eventCallback = () => {
                res(null);
            };
            this.on(eventName, eventCallback);
        }).then(_ => {
            this.off(eventName, eventCallback);
        });
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
        return this.__eventBus__.emit(event, ...args);
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
        return this.__eventBus__.emitLinear(event, ...args);
    }

    /**
     * find first child element using selector
     *
     * @param {string} selector
     * @return {*} 
     * @memberof Component
     */
    find(selector: string) {
        // nodetype 8 is comment
        if (this.element.nodeType === 8) return;
        return this.element.querySelector<HTMLElement>(selector);
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
        const globalFormatter = this.__app__['_formatter'];
        if (globalFormatter[formatterName]) {
            return globalFormatter[formatterName](value);
        }
        else if (this.__formatters__[formatterName]) {
            return this.__formatters__[formatterName](value);
        }
        new Logger(ERROR_TYPE.InvalidFormatter, {
            formatter: formatterName
        }).throwPlain();
    }

    /**
     * resolve a state by string path 
     * 
     * useful for nested object 
     * e.g - this.resolve('user.name.first')
     * 
     *
     * @param {*} path
     * @return {*} 
     * @memberof Component
     */
    resolve(path) {
        const properties = isArray(path) ? path : path.split(".");
        return properties.reduce((prev, curr) => prev && prev[curr], this);
    }

    /**
     * global application value
     *
     * @readonly
     * @memberof Component
     */
    get global() {
        return this.__app__.global;
    }

    private __emitStateChange__(key: string, newValue: any, oldValue?: any) {
        this['__watchBus__'].emit(key, newValue, oldValue);
    }


    /**
     * used for events
     *
     * @private
     * @memberof Component
     */
    // tslint:disable-next-line
    private __eventBus__ = new EventBus();

    /**
     * used for property watching
     *
     * @private
     * @memberof Component
     */
    // tslint:disable-next-line
    private __watchBus__ = new EventBus();

    // tslint:disable-next-line
    private __app__: Mahal;

    // tslint:disable-next-line
    private __ob__: Observer;

    // tslint:disable-next-line
    private __directive__;

    // tslint:disable-next-line
    private __formatters__;

    // tslint:disable-next-line
    private __props__;

    // tslint:disable-next-line
    private __reactives__;

    // tslint:disable-next-line
    private __file__;

    // tslint:disable-next-line
    private __computed__;
    timer = new Timer();

}
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { Observer, Logger } from "../helpers";
import { ILazyComponent, IRenderContext, } from "../interface";
import { isArray, isNull, EventBus, Timer } from "../utils";
import { Mahal } from "../mahal";

// do not rename this, this has been done to merge Component
// // tslint:disable-next-line
// export interface Component {

// }

export abstract class Component {
    children: { [key: string]: typeof Component | ILazyComponent };
    element: HTMLElement;
    render?(context: IRenderContext): Promise<HTMLElement>;

    /**
     * contains component mounted dom element
     *
     * @type {HTMLElement}
     * @memberof Component
     */

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

    onInit() {

    }

    private __emitStateChange__(key: string, newValue: any, oldValue?: any) {
        this['__watchBus__'].emit(key, newValue, oldValue);
    }

    setState(key: string, newValue: any, oldValue?: any) {
        this[key] = newValue;
        this.__emitStateChange__(key, newValue, oldValue);
    }

    watch(propName: string, cb: (newValue, oldValue) => void) {
        this.__watchBus__.on(propName, cb);
        return this;
    }

    unwatch(propName: string, cb?: (newValue, oldValue) => void) {
        this.__watchBus__.off(propName, cb);
        return this;
    }

    on(event: string, cb: Function) {
        this.__eventBus__.on(event, cb);
        return this;
    }

    off(event: string, cb: Function) {
        this.__eventBus__.off(event, cb);
    }

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

    find(selector: string) {
        if (this.element.nodeType === 8) return;
        return this.element.querySelector(selector);
    }

    findAll(selector: string) {
        return this.element.querySelectorAll(selector);
    }

    get outerHTML() {
        return this.element.outerHTML;
    }

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

    resolve(path) {
        const properties = isArray(path) ? path : path.split(".");
        return properties.reduce((prev, curr) => prev && prev[curr], this);
    }


    /**
     * used for events
     *
     * @private
     * @memberof Component
     */
    private __eventBus__ = new EventBus();

    /**
     * used for property watching
     *
     * @private
     * @memberof Component
     */
    private __watchBus__ = new EventBus();
    private __app__: Mahal;

    private __ob__: Observer;

    private __directive__;

    private __formatters__;
    private __props__;
    private __reactives__;

    private __file__;
    private __computed__;
    timer = new Timer();
    get global() {
        return this.__app__.global;
    }
}
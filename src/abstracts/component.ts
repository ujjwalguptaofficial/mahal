import { ERROR_TYPE } from "../enums";
import { Observer, Logger, indexOf, replaceIfNull, emitError } from "../helpers";
import { ILazyComponent, IRenderContext, } from "../interface";
import { isArray, EventBus, Timer, emitStateChange } from "../utils";
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
        this.children = replaceIfNull(this.children, {});
        this.__formatters__ = replaceIfNull(this.__formatters__, {});
        this.__directive__ = replaceIfNull(this.__directive__, {});
        this.__props__ = replaceIfNull(this.__props__, {});
        this.__computed__ = replaceIfNull(this.__computed__, {});
        this.__reactives__ = replaceIfNull(this.__reactives__, {});
    }

    render?(context: IRenderContext): HTMLElement;

    /**
     * called just after the constructor - can be used to listen events
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
        const emitChange = (propToEmit, value1, value2?) => {
            if (this.__reactives__[key]) return;
            if (process.env.NODE_ENV !== "production") {
                const componentProps = this.__props__;
                if (Component.shouldCheckProp && componentProps[key]) {
                    new Logger(ERROR_TYPE.MutatingProp, {
                        html: this.outerHTML,
                        key: key
                    }).logPlainError();
                }
            }
            emitStateChange.call(this, propToEmit, value1, value2);
        };
        const firstValue = args[0];
        let oldValue;
        if (splittedKey.length > 1) {
            const storedValue = this.getState(key);
            const prop = splittedKey.pop();
            const targetKey = splittedKey.join(".");
            const prefix = targetKey + ".";
            const target = this.getState(targetKey);
            if (typeof storedValue === "function") {
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
                    emitChange(`${prefix}update`, { key: prop, value: firstValue });
                } else {
                    emitChange(`${prefix}add`, {
                        value: firstValue,
                        key: prop,
                    });
                }
                // emitChange(prefix + (prop as string), firstValue, oldValue);
            }
            return;
        }
        oldValue = this[key];
        this[key] = firstValue;
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
        return this.__watchBus__.on(propName, cb);
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
        this.__watchBus__.off(propName, eventListener);
    }

    /**
     * subscribe to events
     *
     * @param {string} event
     * @param {Function} cb
     * @return {*} 
     * @memberof Component
     */
    on(event: "destroy" | "mount" | "create" | "update" | "error", cb: Function);
    on(event: string, cb: Function);
    on(event: any, cb: Function) {
        return this.__eventBus__.on(event, cb);
    }

    /**
     * unsubscribe to events
     *
     * @param {string} event
     * @param {Function} cb
     * @memberof Component
     */
    off(event: string, eventListener: Function) {
        this.__eventBus__.off(event, eventListener);
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
        }).then(() => {
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
        try {
            if (globalFormatter[formatterName]) {
                return globalFormatter[formatterName](value);
            }
            else if (this.__formatters__[formatterName]) {
                return this.__formatters__[formatterName](value);
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
     * e.g - this.resolve('user.name.first')
     * 
     *
     * @param {*} path
     * @return {*} 
     * @memberof Component
     */
    getState(path) {
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
    private __reactives__: { [key: string]: boolean };

    // tslint:disable-next-line
    private __file__;

    // tslint:disable-next-line
    private __computed__;
    timer = new Timer();

    static shouldCheckProp = true;

    getMethod(methodName: string) {
        return this[methodName] as Function;
    }

}
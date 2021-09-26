import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import {
    setAndReact, Observer, deleteAndReact, attachGetterSetter
} from "../helpers";
import { IRenderContext, } from "../interface";
import { isArray, Logger, isNull, EventBus, Timer, nextTick, forOwn, } from "../utils";
import { Mahal } from "../mahal";

// do not rename this, this has been done to merge Component
export interface Component {
    render?(context: IRenderContext): Promise<HTMLElement>;

}

export abstract class Component {
    children: { [key: string]: typeof Component };
    element: HTMLElement;
    template: string;

    isMounted = false;

    constructor() {
        this.on(LIFECYCLE_EVENT.Create, () => {
            const computed = this._computed;
            for (const key in computed) {
                const data = computed[key];
                this._reactives.push(key);
                data.args.forEach(arg => {
                    this.watch(arg, () => {
                        this[key] = data.fn.call(this);
                    });
                })
            }
            attachGetterSetter(this);
        });
        if (isNull(this.children)) {
            this.children = {};
        }
        if (isNull(this._formatters)) {
            this._formatters = {};
        }
        if (isNull(this._directive)) {
            this._directive = {};
        }
        if (isNull(this._props)) {
            this._props = {};
        }
        if (isNull(this._computed)) {
            this._computed = {};
        }


    }

    setState(key: string, newValue: any, oldValue?: any) {
        this['_watchBus'].emit(key, newValue, oldValue);
    }

    setManyState(value: { [key: string]: any }) {
        forOwn(value, (key, value) => {
            this.setState(key, value);
        })
    }

    destroy() {
        this.element.parentNode.removeChild(this.element);
    }

    watch(propName: string, cb: (newValue, oldValue) => void) {
        this._watchBus.on(propName, cb);
        return this;
    }

    unwatch(propName: string, cb?: (newValue, oldValue) => void) {
        this._watchBus.off(propName, cb);
        return this;
    }

    set(target, prop, valueToSet) {
        setAndReact(target, prop, valueToSet);
    }

    delete(target, prop) {
        deleteAndReact(target, prop);
    }

    on(event: string, cb: Function) {
        this._eventBus.on(event, cb);
        return this;
    }

    off(event: string, cb: Function) {
        this._eventBus.off(event, cb);
    }

    waitFor<T>(eventName: string) {
        return new Promise<T>((res) => {
            const eventCallback = () => {
                res();
                nextTick(_ => {
                    this.off(eventName, eventCallback);
                })
            }
            this.on(eventName, eventCallback);
        });
    }

    emit(event: string, ...args) {
        return this._eventBus.emit(event, ...args);
    }

    find(selector: string) {
        if (this.element.nodeType == 8) return;
        return this.element.querySelector(selector);
    }

    findAll(selector: string) {
        return this.element.querySelectorAll(selector);
    }

    get outerHTML() {
        return this.element.outerHTML;
    }

    format(formatterName: string, value) {
        const globalFormatter = this._app['_formatter'];
        if (globalFormatter[formatterName]) {
            return globalFormatter[formatterName](value);
        }
        else if (this._formatters[formatterName]) {
            return this._formatters[formatterName](value);
        }
        new Logger(ERROR_TYPE.InvalidFormatter, {
            formatter: formatterName
        }).throwPlain();
    }

    resolve(path) {
        const properties = isArray(path) ? path : path.split(".");
        return properties.reduce((prev, curr) => prev && prev[curr], this);
    }



    private _eventBus = new EventBus(this);
    private _watchBus = new EventBus(this);
    private _app: Mahal;

    private _inPlaceWatchers = {};


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

    private _ob: Observer;

    private _directive;

    private _formatters;
    private _props;
    private _reactives;

    private _file;
    private _computed;
    private _timer = new Timer()
}
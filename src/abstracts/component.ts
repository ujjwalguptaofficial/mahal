import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import {
    setAndReact, Observer, deleteAndReact, attachGetterSetter
} from "../helpers";
import { IPropOption, ITajStore, IRenderContext, } from "../interface";
import { globalFormatter } from "../constant";
import { isArray, nextTick, Logger, isNull, EventBus, } from "../utils";

// do not rename this, this has been done to merge Component
export interface Component {
    render?(context: IRenderContext): HTMLElement;
}

export abstract class Component {
    children: { [key: string]: typeof Component };
    element: HTMLElement;
    template: string;
    $store: ITajStore;

    constructor() {
        nextTick(() => {
            const computed = this.computed_;
            for (const key in computed) {
                const data = computed[key];
                this.reactives_.push(key);
                data.args.forEach(arg => {
                    this.watch(arg, () => {
                        this[key] = data.fn.call(this);
                    });
                })
            }
            attachGetterSetter.call(this);
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
        if (isNull(this.computed_)) {
            this.computed_ = {};
        }
        if (isNull(this.watchList_)) {
            this.watchList_ = {};
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

    waitFor<T>(eventName: string) {
        return new Promise<T>((res) => {
            this.on(eventName, res);
        });
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

    private inPlaceWatchers = {};


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
    };

    private storeWatchCb_: Array<{ key: string, cb: Function }> = [];

    private storeGetters_: Array<{ prop: string, state: string }>;

    private file_;
    private computed_;
}
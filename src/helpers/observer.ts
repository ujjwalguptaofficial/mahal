import { isArray, getObjectLength, Logger, isObject, merge } from "../utils";
import { ERROR_TYPE } from "../enums";

export class Observer {

    static shouldCheckProp = true;
    onChange: (key: string, newValue, oldValue?) => void;

    constructor(onChange) {
        this.onChange = onChange;
    }

    create(input: object, keys?: string[], prefix = "") {
        const onChange = this.onChange;

        const proxy = new Proxy(input, {
            get(target, prop, receiver) {
                return Reflect.get(target, prop, receiver);
            },
            set(target, prop, value, receiver) {
                return Reflect.set(target, prop, value, receiver);
            },
            apply(target, thisArgs, args) {
                return Reflect.apply(
                    target as any, thisArgs, args
                );
            },
            has(target, prop) {
                return Reflect.has(target, prop);
            },
            construct(target, args) {
                return Reflect.construct(target as any, args);
            }
        });

        return proxy;
    }

    destroy() {
        this.onChange = null;
    }
}


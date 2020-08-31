import { isArray, isNull, isPrimitive } from "../utils";
import { nextTick } from "./next_tick";
export class Observer {
    input;

    constructor(input) {
        this.input = input;
    }

    create(onSet: (key: string, oldValue, newValue) => void, onAttach?: (key: string) => void, keys?: any[]) {
        keys = keys || Object.keys(this.input);
        const cached = {};
        keys.forEach(key => {
            cached[key] = this.input[key];
            Object.defineProperty(this.input, key, {
                set(newValue) {
                    const oldValue = cached[key];
                    cached[key] = newValue;
                    nextTick(() => {
                        onSet(key, oldValue, newValue);
                    })
                },
                get() {
                    return cached[key];
                }

            });
            if (onAttach) {
                onAttach(key);
            }
        })
    }

    createForArray(onSet: (arrayProp, payload) => void, keys?: any[]) {
        keys = keys || ["push", "splice"]
        const cached = {};
        keys.forEach(key => {
            cached[key] = this[key];
            Object.defineProperty(this.input, key, {
                value: function (...args) {
                    let result = Array.prototype[key].apply(this, args);
                    nextTick(() => {
                        onSet(key, (() => {
                            switch (key) {
                                case 'push':
                                    return args[0];
                                default:
                                    return args;
                            }
                        })());
                    });
                    return result;
                }
            });
        })
    }
}
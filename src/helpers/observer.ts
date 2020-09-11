import { isArray, isNull, isPrimitive } from "../utils";
import { nextTick } from "../utils";
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

        this.input.__proto__.push = (value, key) => {
            this.input[key] = value;
            const length = Object.keys(this.input).length;
            Object.defineProperty(this.input, key, {
                set(newValue) {
                    const oldValue = value;
                    value = newValue;
                    nextTick(() => {
                        onSet(key, oldValue, newValue);
                    })
                },
                get() {
                    return value;
                }
            })
            onSet("push", {
                value: value,
                key: key,
                length: length
            }, null);
            return length;
        }
        // splice
        this.input.__proto__.splice = (index, noOfItemToDelete) => {
            onSet("splice", [index, noOfItemToDelete], null);
        }

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
                                    // return args[0];
                                    return {
                                        value: args[0],
                                        key: result - 1,
                                        length: result
                                    }
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
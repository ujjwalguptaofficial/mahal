import { isArray, getObjectLength, Logger } from "../utils";
import { nextTick } from "../utils";
import { isObject } from "util";
import { ERROR_TYPE } from "../enums";

export class Observer {

    static shouldCheckProp = true;

    onChange: (key: string, oldValue, newValue) => void;

    create(input: object, keys?: string[], prefix = "") {
        const cached = {};
        const onChange = this.onChange;
        if (isArray(input)) {
            keys = keys || ["push", "splice"];
            keys.forEach(key => {
                cached[key] = this[key];
                Object.defineProperty(input, key, {
                    value: function (...args) {
                        const result = Array.prototype[key].apply(this, args);
                        nextTick(() => {
                            onChange(prefix + key, (() => {
                                switch (key) {
                                    case 'push':
                                        // return args[0];
                                        return {
                                            value: args[0],
                                            key: result - 1,
                                            length: result
                                        };
                                    default:
                                        return args;
                                }
                            })(), null);
                        });
                        return result;
                    }
                });
            });
            return;
        }
        keys = keys || Object.keys(input);

        keys.forEach(key => {
            cached[key] = input[key];
            Object.defineProperty(input, key, {
                set(newValue) {
                    const oldValue = cached[key];
                    if (oldValue === newValue) return;
                    cached[key] = newValue;
                    if (process.env.NODE_ENV !== "production") {
                        if (Observer.shouldCheckProp && (input as any).props_[key]) {
                            new Logger(ERROR_TYPE.MutatingProp, {
                                el: (input as any).element,
                                key: key
                            }).logPlainError();
                        }
                    }

                    nextTick(() => {
                        onChange(prefix + key, oldValue, newValue);
                    });
                },
                get() {
                    return cached[key];
                }

            });

            if (isObject(input[key])) {
                this.create(input[key], null, `${prefix}${key}.`);
            }
        });

        Object.defineProperty(input, "push", {
            enumerable: false,
            value: function (value, keyToAdd) {
                this[keyToAdd] = value;
                const length = getObjectLength(this);
                onChange(`${prefix}push`, {
                    value: value,
                    key: keyToAdd,
                    length: length
                }, null);
                return length;
            }
        });

        Object.defineProperty(input, "splice", {
            enumerable: false,
            value: (index, noOfItemToDelete) => {
                onChange(`${prefix}splice`, [index, noOfItemToDelete], null);
            }
        });

        Object.defineProperty(input, "update", {
            enumerable: false,
            value: function (prop, value) {
                this[prop] = value;
                onChange(`${prefix}update`, [prop, value], null);
            }
        });
    }
}


import { isArray, getObjectLength, Logger, isObject } from "../utils";
import { ERROR_TYPE } from "../enums";

export class Observer {

    static shouldCheckProp = true;
    onChange: (key: string, newValue, oldValue?) => void;

    constructor(onChange) {
        this.onChange = onChange;
    }

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
                        })());
                        return result;
                    }
                });
            });
            return;
        }
        keys = keys || Object.keys(input);
        keys.forEach(key => {
            cached[key] = input[key];
            const registerChild = (newValue, oldValue) => {
                if (isObject(input[key])) {
                    const objectValKeyWithPrefix = `${prefix}${key}.`;
                    if (oldValue != null) {
                        newValue = newValue || {};
                        for (const valKey in oldValue) {
                            onChange(`${objectValKeyWithPrefix}${valKey}`, newValue[valKey], oldValue[key]);
                        }
                    }

                    this.create(input[key], null, objectValKeyWithPrefix);
                }
            };
            Object.defineProperty(input, key, {
                set(newValue) {
                    const oldValue = cached[key];
                    if (oldValue === newValue) return;
                    cached[key] = newValue;
                    if (process.env.NODE_ENV !== "production") {
                        if (Observer.shouldCheckProp && (input as any)._props && (input as any)._props[key]) {
                            new Logger(ERROR_TYPE.MutatingProp, {
                                html: (input as any).outerHTML,
                                key: key
                            }).logPlainError();
                        }
                    }

                    onChange(prefix + key, newValue, oldValue);
                    registerChild(newValue, oldValue);
                },
                get() {
                    return cached[key];
                }

            });
            registerChild(null, null);
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
                });
                return length;
            }
        });

        Object.defineProperty(input, "splice", {
            enumerable: false,
            value: (index, noOfItemToDelete) => {
                onChange(`${prefix}splice`, [index, noOfItemToDelete]);
            }
        });

        Object.defineProperty(input, "update", {
            enumerable: false,
            value: function (prop, value) {
                this[prop] = value;
                onChange(`${prefix}update`, [prop, value]);
            }
        });
    }

    destroy() {
        this.onChange = null;
    }
}


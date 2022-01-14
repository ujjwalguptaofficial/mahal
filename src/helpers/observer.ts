import { isArray, getObjectLength, Logger, isObject, merge, hashifyArray, indexOf } from "../utils";
import { ERROR_TYPE } from "../enums";

export class Observer {

    static shouldCheckProp = true;
    onChange: (key: string, newValue, oldValue?) => void;

    constructor(onChange) {
        this.onChange = onChange;
    }

    create(input: object, keys?: string[], prefix = "") {
        const onChange = this.onChange;
        const isInputArray = isArray(input);
        keys = keys || (isInputArray ? [] : Object.keys(input));
        const hashkeys = hashifyArray(keys);
        const registerChild = (key, newValue, oldValue) => {
            const objectValKeyWithPrefix = `${prefix}${key}.`;
            if (oldValue != null) {
                const mergedNewValue = merge(oldValue, newValue || {});
                for (const valKey in mergedNewValue) {
                    onChange(`${objectValKeyWithPrefix}${valKey}`, mergedNewValue[valKey], oldValue[valKey]);
                }
            }

            return this.create(newValue, null, objectValKeyWithPrefix);
        };
        if (isInputArray) {
            const proxy = new Proxy(input, {
                get(target, prop, receiver) {
                    switch (prop) {
                        case 'push':
                        case 'splice':
                            return (...args) => {
                                const result = target[prop](...args);
                                onChange(prefix + prop, (() => {
                                    switch (prop) {
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
                            };
                    }
                    return Reflect.get(target, prop, receiver);
                },
                set: (target, prop: string, newValue, receiver) => {
                    let oldValue = target[prop];
                    if (oldValue === newValue) return true;

                    let setValue: boolean;
                    if (isObject(newValue)) {
                        const proxyChild = registerChild(prop, newValue, oldValue);
                        setValue = Reflect.set(
                            target, prop, proxyChild, receiver
                        );
                    }
                    else {
                        setValue = Reflect.set(target, prop, newValue, receiver);
                    }
                    onChange(`${prefix}update`, [Number(prop), newValue]);
                    return setValue;
                },
                apply(target, thisArgs, args) {
                    return Reflect.apply(
                        target as any, thisArgs, args
                    );
                },
                has(target, prop) {
                    return Reflect.has(target, prop);
                }
            });
            return proxy;
        }
        const proxy = new Proxy(input, {
            deleteProperty(target, prop) {
                const index = indexOf(target, prop);
                const noOfItemToDelete = 1;
                const isValueDeleted = Reflect.deleteProperty(target, prop);
                onChange(`${prefix}splice`, [index, noOfItemToDelete]);
                return isValueDeleted;
            },
            get(target, prop, receiver) {
                return Reflect.get(target, prop, receiver);
            },
            set: (target, prop: string, newValue, receiver) => {
                let oldValue = target[prop];
                if (oldValue === newValue) return true;
                // if (!hashkeys[prop] && !prefix) {
                //     return Reflect.set(target, prop, newValue, receiver);
                // }
                let isValueSetted: boolean;
                if (process.env.NODE_ENV !== "production") {
                    try {
                        const componentProps = input['_props']
                        if (componentProps && Observer.shouldCheckProp && componentProps[prop]) {
                            new Logger(ERROR_TYPE.MutatingProp, {
                                html: (input as any).outerHTML,
                                key: prop
                            }).logPlainError();
                        }
                    } catch (error) {

                    }

                }

                const setValue = () => {
                    if (isObject(newValue)) {
                        const proxyChild = registerChild(prop, newValue, oldValue);
                        return Reflect.set(
                            target, prop, proxyChild, receiver
                        );
                    }
                    else {
                        return Reflect.set(target, prop, newValue, receiver);
                    }
                };

                if (hashkeys[prop]) {
                    isValueSetted = setValue();
                    onChange(prefix + (prop as string), newValue, oldValue);
                    return isValueSetted;
                }

                if (prefix) {
                    isValueSetted = setValue();
                    if (oldValue != null) {
                        if (target.hasOwnProperty(prop)) {
                            onChange(`${prefix}update`, [prop, newValue]);
                        }
                    } else {
                        const length = getObjectLength(target);
                        onChange(`${prefix}push`, {
                            value: newValue,
                            key: prop,
                            length: length
                        });
                    }

                    return isValueSetted;
                }

                return Reflect.set(target, prop, newValue, receiver);
            },
            apply(target, thisArgs, args) {
                return Reflect.apply(
                    target as any, thisArgs, args
                );
            },
            has(target, prop) {
                return Reflect.has(target, prop);
            },
            // defineProperty(target, prop, attributes) {
            //     debugger;
            //     return Reflect.defineProperty(target, prop, attributes);
            // }
        });
        keys.forEach((key) => {
            if (isObject(input[key])) {
                input[key] = registerChild(key, input[key], null);
            }
        });
        return proxy;
    }

    destroy() {
        this.onChange = null;
    }
}


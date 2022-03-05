import { isArray, getObjectLength, isObject, merge, hashifyArray } from "../utils";
import { ERROR_TYPE } from "../enums";
import { Logger } from "./logger";
import { indexOf } from "./index_of";
import { getArrayEmitResult } from "./get_array_emit_result";

export class Observer {

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
            const arrProxy = new Proxy(input, {
                get(target, prop, receiver) {
                    switch (prop) {
                        case 'push':
                        case 'splice':
                        case 'pop':
                        case 'shift':
                        case 'unshift':
                        case 'reverse':
                            return (...args) => {
                                const result = target[prop](...args);
                                onChange(prefix + prop, getArrayEmitResult.call(this, target, prop, args, result));
                                return result;
                            };
                    }
                    return Reflect.get(target, prop, receiver);
                },
                set: (target, prop: string, newValue, receiver) => {
                    const setValue = Reflect.set(target, prop, newValue, receiver);
                    onChange(`${prefix}update`, [Number(prop), newValue]);
                    return setValue;
                }
            });
            return arrProxy;
        }
        const proxy = new Proxy(input, {
            deleteProperty(target, prop) {
                const index = indexOf(target, prop);
                const noOfItemToDelete = 1;
                const isValueDeleted = Reflect.deleteProperty(target, prop);
                onChange(`${prefix}splice`, [index, noOfItemToDelete]);
                return isValueDeleted;
            },
            set: (target, prop: string, newValue, receiver) => {
                const oldValue = target[prop];
                let isValueSetted: boolean;

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
                    if (oldValue !== undefined) {
                        if (target.hasOwnProperty(prop)) {
                            onChange(`${prefix}update`, [prop, newValue]);
                        }
                    } else {
                        const length = getObjectLength(target);
                        onChange(`${prefix}add`, {
                            value: newValue,
                            key: prop,
                            length: length
                        });
                    }

                    return isValueSetted;
                }

                return Reflect.set(target, prop, newValue, receiver);
            },


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


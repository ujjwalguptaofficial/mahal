import { Component } from "../abstracts";
import { ARRAY_MUTABLE_METHODS } from "../constant";
import { isArray, isObject, merge, hashifyArray, nextTick, getObjectKeys } from "../utils";
import { indexOf } from "./index_of";

export class Observer {

    onChange: (key: string, newValue, oldValue?) => void;
    comp: Component;

    constructor(onChange, component: Component) {
        this.onChange = onChange;
        this.comp = component;
    }

    create(input: object, keys?: string[], prefix = "") {
        const onChange = this.onChange;
        const isInputArray = isArray(input);
        keys = keys || (isInputArray ? ARRAY_MUTABLE_METHODS : getObjectKeys(input));
        keys.forEach(key => {
            this.comp['_reactives_'][prefix + key] = true;
        });
        const hashkeys = hashifyArray(keys);
        const registerChild = (key, newValue, oldValue) => {
            const objectValKeyWithPrefix = `${prefix}${key}.`;
            nextTick(_ => {
                if (oldValue != null) {
                    newValue = newValue || {};
                    const mergedNewValue = merge(oldValue, newValue);
                    for (const valKey in mergedNewValue) {
                        onChange(`${objectValKeyWithPrefix}${valKey}`,
                            newValue[valKey],
                            oldValue[valKey]
                        );
                    }
                }
            });
            return this.create(newValue, null, objectValKeyWithPrefix);
        };
        if (isInputArray) {
            const arrProxy = new Proxy(input, {
                get(target, prop, receiver) {
                    if (hashkeys[prop]) {
                        return (...args) => {
                            const result = target[prop](...args);
                            onChange(prefix + (prop as string), args);
                            return result;
                        };
                    }
                    return Reflect.get(target, prop, receiver);
                },
                set: (target, prop: string, newValue, receiver) => {
                    const oldValue = target[prop];
                    const setValue = Reflect.set(target, prop, newValue, receiver);
                    onChange(`${prefix}update`, { key: prop, value: newValue, oldValue });
                    return setValue;
                }
            });
            return arrProxy;
        }
        const proxy = new Proxy(input, {
            deleteProperty(target, prop) {
                const index = indexOf(target, prop);
                const isValueDeleted = Reflect.deleteProperty(target, prop);
                onChange(`${prefix}delete`, { key: prop, index });
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
                    if (prefix) {
                        onChange(`${prefix}update`, { key: prop, value: newValue, oldValue });
                    }
                    return isValueSetted;
                }

                if (prefix) {
                    isValueSetted = setValue();
                    if (oldValue !== undefined) {
                        if (target.hasOwnProperty(prop)) {
                            onChange(`${prefix}update`, { key: prop, value: newValue, oldValue });
                        }
                    } else {
                        onChange(`${prefix}add`, {
                            value: newValue,
                            key: prop,
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


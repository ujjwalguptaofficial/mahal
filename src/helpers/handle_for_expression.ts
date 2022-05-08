import { Component } from "../abstracts";
import { createCommentNode } from "./create_coment_node";
import { isPrimitive, isNull, isArray, getObjectLength, promiseResolve, forEach } from "../utils";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { emitUpdate } from "./emit_update";
import { emitError } from "./emit_error";
import { Logger } from "./logger";
import { indexOf } from "./index_of";
import { getElementKey } from "./get_el_key";

const forExpMethods = ['push', 'add', 'splice', 'update', 'delete', 'pop', 'shift', 'unshift', 'reverse'];


export function handleForExp(this: Component, key: string, method: (...args) => Promise<HTMLElement>) {
    let cmNode = createCommentNode();
    const els = [cmNode];
    let resolvedValue = this.getState(key);
    if (process.env.NODE_ENV !== 'production') {
        if (isPrimitive(resolvedValue) || isNull(resolvedValue)) {
            new Logger(ERROR_TYPE.ForOnPrimitiveOrNull, key).throwPlain();
        }
    }

    forEach(resolvedValue, (value, prop) => {
        els.push(
            (method as any)(value, prop)
        );
    });

    const isValueArray = isArray(resolvedValue);
    let callBacks = {
        [key]: (newValue, oldValue) => {
            handleChange("reset", [oldValue, newValue]);
        },
        [`${key}.push`]: (values) => {
            handleChange("push", values);
        },
        [`${key}.add`]: (newValue) => {
            handleChange("add", newValue);
        },
        [`${key}.pop`]: () => {
            const length = getObjectLength(this.getState(key));
            handleChange("splice", [length, 1]);
        },
        [`${key}.shift`]: () => {
            handleChange("splice", [0, 1]);
        },
        [`${key}.unshift`]: (newValue) => {
            handleChange("splice", [0, 0, newValue]);
        },
        [`${key}.reverse`]: () => {
            const reversedResult = this.getState(key);
            handleChange("reset", [reversedResult, reversedResult]);
            // const reversedResult = newValue;
            // const length = getObjectLength(reversedResult);
            // handleChange("splice", [0, length, ...reversedResult]);
        },
        [`${key}.splice`]: (newValue) => {
            handleChange("splice", newValue);
        },
        [`${key}.delete`]: (args) => {
            handleChange("splice", [args.index, 1]);
        },
        [`${key}.update`]: (newValue) => {
            handleChange("update", newValue);
        }
    };
    const onElDestroyed = () => {
        cmNode.removeEventListener(LIFECYCLE_EVENT.Destroy, onElDestroyed);
        cmNode = null;
        for (const ev in callBacks) {
            this.unwatch(ev, callBacks[ev]);
        }
        callBacks = null;
    };
    cmNode.addEventListener(LIFECYCLE_EVENT.Destroy, onElDestroyed);
    const handleChange = (methodName, params) => {
        const parent = cmNode.parentNode;
        const childNodes = parent.childNodes;
        const indexOfRef = Array.prototype.indexOf.call(childNodes, cmNode);
        const methods = {
            push: () => {
                const newValue = params;
                const fragDoc = document.createDocumentFragment();
                const promiseList = [];
                const fromIndex = getObjectLength(this.getState(key)) - newValue.length;
                forEach(newValue, (value, prop) => {
                    promiseList.push(
                        method(value, prop + fromIndex).then(newElement => {
                            fragDoc.appendChild(newElement);
                        })
                    );
                });

                return Promise.all(promiseList).then(_ => {
                    parent.insertBefore(
                        fragDoc, childNodes[indexOfRef + 1 + fromIndex]
                    );
                });
            },
            reset() {
                const oldValue = params[0];
                const newValue = params[1];
                const fragDoc = document.createDocumentFragment();
                const promiseList = [];
                forEach(newValue, (value, prop) => {
                    promiseList.push(
                        method(value, prop).then(newElement => {
                            fragDoc.appendChild(newElement);
                        })
                    );
                });

                return Promise.all(promiseList).then(_ => {
                    // value resetted
                    // runForExp(key, newValue, method);
                    // const parent = cmNode.parentNode;
                    // remove all nodes

                    for (let i = 0, len = getObjectLength(oldValue); i < len; i++) {
                        parent.removeChild(cmNode.nextSibling);
                    }
                    parent.insertBefore(
                        fragDoc, childNodes[indexOfRef + 1]
                    );
                });
            },
            add: () => {
                const savedValue = this.getState(key);
                const length = getObjectLength(savedValue);
                return method(params.value, params.key).then(newElement => {
                    parent.insertBefore(newElement, childNodes[indexOfRef + length]);
                });
            },
            splice: () => {
                // i==1 for comment nodes 
                const relativeIndex = indexOfRef + params[0];
                // remove elements
                const removeElements = () => {
                    for (let i = 1; i <= params[1]; i++) {
                        const child = childNodes[relativeIndex + 1];
                        if (child) {
                            parent.removeChild(child);
                        }
                    }
                };

                if (!isValueArray) {
                    removeElements();
                    return promiseResolve(null);
                }

                // add new elements from splice third arguments
                const promises = [];
                const frag = document.createDocumentFragment();
                for (let i = 2, j = params[0], paramLength = params.length; i < paramLength; i++, j++) {
                    promises.push(
                        method(params[i], j).then(newElement => {
                            frag.appendChild(newElement);
                        })
                    );
                }



                // arrange items after insertion
                const from = (params.length - 2) + params[0];
                // resolvedValue = this.resolve(key);
                const sliced = this.getState(key).slice(from);
                // const asyncElements = runForExp(key, sliced, method);
                return Promise.all([
                    Promise.all(promises),
                    Promise.all(
                        sliced.map((item, itemIndex) => {
                            return method(item, from + itemIndex);
                        })
                    )
                ]).then(results => {
                    removeElements();
                    parent.insertBefore(frag, childNodes[indexOfRef + 1 + params[0]]);
                    const spliceRefIndex = indexOfRef + 1 + params[0] + params.length - 2;
                    results[1].forEach((newEl: HTMLElement, elementIndex) => {
                        const el = childNodes[spliceRefIndex + elementIndex];
                        const elKey = getElementKey(el);
                        if (elKey == null || elKey !== getElementKey(newEl)) {
                            parent.replaceChild(newEl, el);
                        }
                        // el.replaceWith()
                        // parent.replaceChild(newEl, el);
                    });
                });
            },
            update: () => {
                resolvedValue = this.getState(key);
                let paramKey = params.key;
                let index;
                if (isValueArray) {
                    paramKey = index = Number(paramKey);
                }
                else {
                    index = indexOf(resolvedValue, paramKey);
                }
                if (index >= 0) {
                    return method(params.value, paramKey).then(newElement => {
                        parent.replaceChild(newElement, childNodes[indexOfRef + 1 + index]);
                    });
                }
                return promiseResolve(null);
            }
        };
        methods[methodName]().then(_ => {
            emitUpdate(this);
        }).catch(err => {
            emitError.call(this, err);
        });
    };
    this.watch(key, callBacks[key]);
    forExpMethods.forEach(methodName => {
        this.watch(`${key}.${methodName}`, callBacks[`${key}.${methodName}`]);
    });

    return els;
}
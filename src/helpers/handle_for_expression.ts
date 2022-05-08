import { Component } from "../abstracts";
import { createCommentNode } from "./create_coment_node";
import { isPrimitive, isNull, isArray, getObjectLength, promiseResolve, forEach } from "../utils";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { emitUpdate } from "./emit_update";
import { emitError } from "./emit_error";
import { Logger } from "./logger";
import { indexOf } from "./index_of";
import { getElementKey } from "./get_el_key";
import { ARRAY_MUTABLE_METHODS } from "../constant";

const forExpMethods = ARRAY_MUTABLE_METHODS.concat(['add', 'update', 'delete']);


export function handleForExp(this: Component, key: string, method: (...args) => HTMLElement) {
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
            push() {
                const pushedValue = params;
                const fragDoc = document.createDocumentFragment();
                const fromIndex = getObjectLength(resolvedValue) - pushedValue.length;
                forEach(pushedValue, (value, prop) => {
                    fragDoc.appendChild(
                        method(value, prop + fromIndex)
                    );
                });
                parent.insertBefore(
                    fragDoc, childNodes[indexOfRef + 1 + fromIndex]
                );
            },
            reset() {
                const oldValue = params[0];
                resolvedValue = params[1];
                const fragDoc = document.createDocumentFragment();
                forEach(resolvedValue, (value, prop) => {
                    fragDoc.appendChild(
                        method(value, prop)
                    );
                });

                // remove all nodes
                for (let i = 0, len = getObjectLength(oldValue); i < len; i++) {
                    parent.removeChild(cmNode.nextSibling);
                }

                parent.insertBefore(
                    fragDoc, childNodes[indexOfRef + 1]
                );
            },
            add() {
                const length = getObjectLength(resolvedValue);
                const newElement = method(params.value, params.key);
                parent.insertBefore(newElement, childNodes[indexOfRef + length]);
            },
            splice() {
                // i==1 for comment nodes 
                const relativeIndex = indexOfRef + params[0];
                // remove elements
                for (let i = 1; i <= params[1]; i++) {
                    const child = childNodes[relativeIndex + 1];
                    if (child) {
                        parent.removeChild(child);
                    }
                }

                if (!isValueArray) {
                    return;
                }

                // add new elements from splice third arguments
                const frag = document.createDocumentFragment();
                for (let i = 2, j = params[0], paramLength = params.length; i < paramLength; i++, j++) {
                    const newElement = method(params[i], j);
                    frag.appendChild(newElement);
                }

                // arrange items after insertion
                const from = (params.length - 2) + params[0];
                // resolvedValue = this.resolve(key);
                const sliced = resolvedValue.slice(from);
                // const asyncElements = runForExp(key, sliced, method);
                parent.insertBefore(frag, childNodes[indexOfRef + 1 + params[0]]);
                const spliceRefIndex = indexOfRef + 1 + params[0] + params.length - 2;

                sliced.map((item, itemIndex) => {
                    return method(item, from + itemIndex);
                }).forEach((newEl: HTMLElement, elementIndex) => {
                    const el = childNodes[spliceRefIndex + elementIndex];
                    const elKey = getElementKey(el);
                    if (elKey == null || elKey !== getElementKey(newEl)) {
                        parent.replaceChild(newEl, el);
                    }
                    // el.replaceWith()
                    // parent.replaceChild(newEl, el);
                });
            },
            update() {
                // resolvedValue = this.getState(key);
                let paramKey = params.key;
                let index;
                if (isValueArray) {
                    paramKey = index = Number(paramKey);
                }
                else {
                    index = indexOf(resolvedValue, paramKey);
                }
                if (index >= 0) {
                    const newElement = method(params.value, paramKey);
                    parent.replaceChild(newElement, childNodes[indexOfRef + 1 + index]);
                }
                return null;
            }
        };
        try {
            methods[methodName]();
            emitUpdate(this);
        } catch (err) {
            emitError.call(this, err);
        }
    };
    this.watch(key, callBacks[key]);
    forExpMethods.forEach(methodName => {
        this.watch(`${key}.${methodName}`, callBacks[`${key}.${methodName}`]);
    });

    return els;
}
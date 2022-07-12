import { Component } from "../abstracts";
import { createCommentNode } from "./create_coment_node";
import { isPrimitive, isNull, isArray, getObjectLength, forEach, removeEl, replaceEl, nextTick, insertBefore, patchNode } from "../utils";
import { ERROR_TYPE } from "../enums";
import { emitUpdate } from "./emit_update";
import { emitError } from "./emit_error";
import { Logger } from "./logger";
import { indexOf } from "./index_of";
import { getElementKey } from "./get_el_key";
import { ARRAY_MUTABLE_METHODS } from "../constant";
import { onElDestroy } from "../helpers";

const forExpMethods = ARRAY_MUTABLE_METHODS.concat(['add', 'update', 'delete']);


export function handleForExp(this: Component, key: string, method: (...args) => HTMLElement) {
    let cmNode = createCommentNode();
    let els = [cmNode];
    let resolvedValue = this.getState(key);
    if (process.env.NODE_ENV !== 'production') {
        if (isPrimitive(resolvedValue) || isNull(resolvedValue)) {
            new Logger(ERROR_TYPE.ForOnPrimitiveOrNull, key).throwPlain();
        }
    }
    const elKeyStore: Map<string, HTMLElement> = new Map();
    forEach(resolvedValue, (value, prop) => {
        const el = (method as any)(value, prop);
        els.push(el);
        elKeyStore.set(
            getElementKey(el), el
        );
    });

    const isValueArray = isArray(resolvedValue);
    const callBacks = {
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
            const length = getObjectLength(resolvedValue);
            handleChange("splice", [length, 1]);
        },
        [`${key}.shift`]: () => {
            handleChange("splice", [0, 1]);
        },
        [`${key}.unshift`]: (newValue) => {
            handleChange("splice", [0, 0, newValue]);
        },
        [`${key}.reverse`]: () => {
            handleChange("reset", [resolvedValue, []]);
            handleChange("reset", [[], resolvedValue]);
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
    const eventsId = {};
    const onElDestroyed = () => {
        cmNode = null;
        for (const ev in callBacks) {
            this.unwatch(ev, eventsId[ev]);
        }
    };
    onElDestroy(
        cmNode, onElDestroyed
    );
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
                    const el = method(value, prop + fromIndex);
                    fragDoc.appendChild(
                        el
                    );
                    elKeyStore.set(
                        getElementKey(el), el
                    );
                });
                insertBefore(
                    parent as any,
                    fragDoc,
                    childNodes[indexOfRef + 1 + fromIndex]
                );
            },
            reset() {
                const oldValue = params[0];
                resolvedValue = params[1];
                const oldValueCount = elKeyStore.size;
                const nextIndexRef = indexOfRef + 1;
                const resolvedValueCount = getObjectLength(resolvedValue);
                if (resolvedValueCount > 0) {
                    if (oldValueCount === 0) {
                        params = resolvedValue;
                        return methods.push();
                    }
                    let index = 0;

                    forEach(resolvedValue, (value, prop) => {
                        const newElkey = method(value, prop, true) as any;
                        const oldValueAtProp = oldValue[prop];
                        if (!oldValueAtProp) {
                            const el = method(value, prop);
                            insertBefore(parent as any, el, childNodes[nextIndexRef + index]);
                            elKeyStore.set(newElkey, el);
                        }
                        else {
                            const oldElKey = method(oldValueAtProp, prop, true) as any;
                            const oldEl = elKeyStore.get(oldElKey);
                            if (elKeyStore.has(newElkey)) {
                                if (value !== oldValueAtProp) {
                                    // old elements might need update
                                    const storedEl = elKeyStore.get(newElkey);
                                    if (newElkey !== oldElKey) {
                                        // swap needs to be done
                                        insertBefore(parent as any, storedEl, childNodes[nextIndexRef + index + 1]);
                                    }
                                    else {
                                        const el = method(value, prop);
                                        // here patch needs to be done
                                        patchNode(oldEl, el);
                                        // elKeyStore.set(key, el);
                                    }
                                }
                            }
                            else { // old elements needs to be deleted and newElement needs to inserted
                                // delete old element if any
                                elKeyStore.delete(oldElKey);
                                const el = method(value, prop);
                                replaceEl(oldEl, el);
                                elKeyStore.set(newElkey, el);
                            }
                        }
                        ++index;
                    });
                }

                // remove rest nodes
                for (let i = resolvedValueCount; i < oldValueCount; i++) {
                    const el = childNodes[nextIndexRef + resolvedValueCount] as any;
                    removeEl(el);
                    elKeyStore.delete(
                        getElementKey(el)
                    );
                }
            },
            add() {
                const length = getObjectLength(resolvedValue);
                const newElement = method(params.value, params.key);
                elKeyStore.set(
                    getElementKey(newElement), newElement
                );
                insertBefore(parent as any, newElement, childNodes[indexOfRef + length]);
            },
            splice() {
                // i==1 for comment nodes 
                const relativeIndex = indexOfRef + params[0];
                // remove elements
                const nextRelativeIndex = relativeIndex + 1;
                for (let i = 1; i <= params[1]; i++) {
                    const child = childNodes[nextRelativeIndex];
                    if (child) {
                        removeEl(child as any);
                        elKeyStore.delete(
                            getElementKey(child)
                        );
                    }
                }

                if (!isValueArray) return;

                // add new elements from splice third arguments
                const frag = document.createDocumentFragment();
                const paramLength = params.length;
                const keyInserted = new Map();
                for (let i = 2, j = params[0]; i < paramLength; i++, j++) {
                    const newElement = method(params[i], j);
                    frag.appendChild(newElement);
                    const newElKey = getElementKey(newElement);
                    elKeyStore.set(
                        getElementKey(newElement), newElement
                    );
                    keyInserted.set(newElKey, true);
                }

                const nextIndexRef = indexOfRef + 1;
                insertBefore(parent as any, frag, childNodes[nextIndexRef + params[0]]);

                // arrange items after insertion
                const from = (paramLength - 2) + params[0];

                const spliceRefIndex = nextIndexRef + params[0] + paramLength - 2;

                for (let itemIndex = 0, length = resolvedValue.length - from; itemIndex < length; itemIndex++) {
                    const actualIndex = from + itemIndex;
                    const item = resolvedValue[actualIndex];
                    const newElKey = method(item, actualIndex, true);
                    const el = childNodes[spliceRefIndex + itemIndex];
                    const elKey = getElementKey(el);
                    if (elKey !== newElKey) {
                        const newEl = method(item, actualIndex);
                        replaceEl(el as any, newEl);
                        elKeyStore.set(
                            newElKey as any, newEl
                        );
                        keyInserted.set(newElKey, true);
                        if (!keyInserted.has(elKey)) {
                            elKeyStore.delete(elKey);
                        }
                    }
                }
            },
            update() {
                let paramKey = params.key;
                let index;
                if (isValueArray) {
                    paramKey = index = Number(paramKey);
                }
                else {
                    index = indexOf(resolvedValue, paramKey);
                }
                if (index >= 0) {
                    const currentEl = childNodes[indexOfRef + 1 + index] as any;
                    const newElement = method(params.value, paramKey);

                    patchNode(currentEl, newElement);
                }
            }
        };
        try {
            nextTick(_ => {
                methods[methodName]();
                emitUpdate(this);
            });
        } catch (err) {
            emitError.call(this, err);
        }
    };
    eventsId[key] = this.watch(key, callBacks[key]);
    forExpMethods.forEach(methodName => {
        const methodKey = `${key}.${methodName}`;
        eventsId[methodKey] = this.watch(methodKey, callBacks[methodKey]);
    });
    nextTick(_ => {
        els = null;
    });
    return els;
}
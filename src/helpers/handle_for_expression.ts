import { Component } from "../abstracts";
import { createCommentNode } from "./create_coment_node";
import { isArray, getObjectLength, forEach, removeEl, replaceEl, nextTick, insertBefore, resolveValue, createDocumentFragment } from "../utils";
import { ERROR_TYPE } from "../enums";
import { emitUpdate } from "./emit_update";
import { emitError } from "./emit_error";
import { Logger } from "./logger";
import { indexOf } from "./index_of";
import { getElementKey } from "./get_el_key";
import { OBJECT_MUTABLE_METHODS } from "../constant";
import { onElDestroy, subscriveToDestroyFromChild } from "../helpers";
import { TYPE_RC_STORAGE } from "../types";

const REACTIVE_CHILD = '_rc_';

export function handleForExp(this: Component, key: string, method: (...args) => HTMLElement) {
    const ctx = this;
    let cmNode = createCommentNode();
    let els: HTMLElement[] = [cmNode as any];
    let resolvedValue = ctx.getState(key);
    if (process.env.NODE_ENV !== 'production') {
        const isPrimitive = (value) => {
            switch (typeof value) {
                case 'undefined':
                case 'object':
                    return false;
            }
            return true;
        };
        if (isPrimitive(resolvedValue) || resolvedValue == null) {
            new Logger(ERROR_TYPE.ForOnPrimitiveOrNull, key).throwPlain();
        }
    }
    const elKeyStore: Map<string, HTMLElement> = new Map();
    const createEl = (value, prop) => {
        const el = method(value, prop);
        elKeyStore.set(
            getElementKey(el), el
        );
        subscriveToDestroyFromChild(el);
        return el;
    };
    const removeElFromCache = (el) => {
        removeEl(el);
        elKeyStore.delete(
            getElementKey(el)
        );
    };

    forEach(resolvedValue, (value, prop) => {
        const el = createEl(value, prop);
        els.push(el);
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
        [`${key}.update`]: (param) => {
            handleChange("update", param);
        }
    };
    const onElDestroyed = () => {
        cmNode = null;
        // for (const ev in callBacks) {
        //     ctx.unwatch(ev, callBacks[ev]);
        // }

        forEach(callBacks, (value, ev) => {
            ctx.unwatch(ev, value);
        });
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
                const fragDoc = createDocumentFragment();
                const fromIndex = getObjectLength(resolvedValue) - pushedValue.length;
                forEach(pushedValue, (value, prop) => {
                    const el = createEl(value, prop + fromIndex);
                    fragDoc.appendChild(
                        el
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
                                        insertBefore(
                                            parent as any,
                                            storedEl,
                                            childNodes[nextIndexRef + index + 1]
                                        );
                                    }
                                    else {
                                        // here patch needs to be done
                                        params = {
                                            key: prop,
                                            value: value,
                                            oldValue: oldValueAtProp
                                        };
                                        methods.update();
                                    }
                                }
                            }
                            else { // old elements needs to be deleted and newElement needs to inserted
                                // delete old element if any
                                elKeyStore.delete(oldElKey);
                                const el = createEl(value, prop);
                                replaceEl(oldEl, el);
                            }
                        }
                        ++index;
                    });
                }

                // remove rest nodes
                for (let i = resolvedValueCount; i < oldValueCount; i++) {
                    const el = childNodes[nextIndexRef + resolvedValueCount] as any;
                    removeElFromCache(el);
                }
            },
            add() {
                const length = getObjectLength(resolvedValue);
                const newElement = createEl(params.value, params.key);
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
                        removeElFromCache(child);
                    }
                }

                if (!isValueArray) return;

                // add new elements from splice third arguments
                const frag = createDocumentFragment();
                const paramLength = params.length;
                const keyInserted = new Map();
                for (let i = 2, j = params[0]; i < paramLength; i++, j++) {
                    const newElement = createEl(params[i], j);
                    frag.appendChild(newElement);
                    const newElKey = getElementKey(newElement);
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
                        const newEl = createEl(item, actualIndex);
                        replaceEl(el as any, newEl);
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
                if (index < 0) return;

                const currentEl = childNodes[indexOfRef + 1 + index] as any;
                const reactiveChild: TYPE_RC_STORAGE = currentEl[REACTIVE_CHILD];
                const oldValue = params.oldValue;
                const newValue = params.value;

                currentEl['_setVal_'](newValue);
                reactiveChild.forEach((oldReactiveEls, reactiveChildProp) => {
                    const newValueAtReactiveChild = resolveValue(reactiveChildProp, newValue);
                    const shouldUpdate = resolveValue(reactiveChildProp, oldValue) !== newValueAtReactiveChild;
                    if (!shouldUpdate) return;
                    oldReactiveEls.forEach((handler) => {
                        (handler as any)(newValueAtReactiveChild);
                    });
                });
            }
        };
        nextTick(_ => {
            try {
                methods[methodName]();
                emitUpdate(ctx);
            } catch (err) {
                emitError.call(ctx, err);
            }
        });
    };
    ctx.watch(key, callBacks[key]);
    OBJECT_MUTABLE_METHODS.forEach(methodName => {
        const methodKey = `${key}.${methodName}`;
        ctx.watch(methodKey, callBacks[methodKey]);
    });
    nextTick(_ => {
        els = null;
    });
    return els;
}
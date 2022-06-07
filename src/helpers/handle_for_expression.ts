import { Component } from "../abstracts";
import { createCommentNode } from "./create_coment_node";
import { isPrimitive, isNull, isArray, getObjectLength, forEach, removeEl, replaceEl, nextTick, insertBefore } from "../utils";
import { ERROR_TYPE } from "../enums";
import { emitUpdate } from "./emit_update";
import { emitError } from "./emit_error";
import { Logger } from "./logger";
import { indexOf } from "./index_of";
import { getElementKey } from "./get_el_key";
import { ARRAY_MUTABLE_METHODS, EVENTS } from "../constant";
import { onElDestroy } from "./on_el_destroy";
import morphdom from "morphdom";
import { dispatchDestroyed } from "./dispatch_destroy";

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

    forEach(resolvedValue, (value, prop) => {
        els.push(
            (method as any)(value, prop)
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
            handleChange("reset", [resolvedValue, resolvedValue]);
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
                    fragDoc.appendChild(
                        method(value, prop + fromIndex)
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

                const nextIndexRef = indexOfRef + 1;

                // remove all nodes
                for (let i = 0, len = getObjectLength(oldValue); i < len; i++) {
                    // parent.removeChild(cmNode.nextSibling);
                    removeEl(childNodes[nextIndexRef] as any);
                }

                if (getObjectLength(resolvedValue) === 0) return;

                const fragDoc = document.createDocumentFragment();
                forEach(resolvedValue, (value, prop) => {
                    fragDoc.appendChild(
                        method(value, prop)
                    );
                });

                insertBefore(
                    parent as any, fragDoc, childNodes[nextIndexRef]
                );
            },
            add() {
                const length = getObjectLength(resolvedValue);
                const newElement = method(params.value, params.key);
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
                    }
                }

                if (!isValueArray) return;

                // add new elements from splice third arguments
                const frag = document.createDocumentFragment();
                const paramLength = params.length;
                for (let i = 2, j = params[0]; i < paramLength; i++, j++) {
                    const newElement = method(params[i], j);
                    frag.appendChild(newElement);
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
                    const newElement = method(params.value, paramKey);
                    morphdom(childNodes[indexOfRef + 1 + index] as any, newElement, {
                        onBeforeElUpdated(fromEl, toEl) {
                            if (fromEl.isEqualNode(toEl)) {
                                return false;
                            }
                            const fromEvs: Map<string, Function> = fromEl[EVENTS];
                            if (fromEvs) {
                                fromEvs.forEach((ev, name) => {
                                    fromEl.removeEventListener(name, ev as any);
                                });
                            }
                            const toEvs: Map<string, Function> = toEl[EVENTS];
                            if (toEvs) {
                                toEvs.forEach((ev, name) => {
                                    fromEl.addEventListener(name, ev as any);
                                });
                            }
                            fromEl[EVENTS] = toEvs;
                            return true;
                        },
                        onBeforeNodeDiscarded(node) {
                            dispatchDestroyed(node);
                            return true;
                        }
                    });
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
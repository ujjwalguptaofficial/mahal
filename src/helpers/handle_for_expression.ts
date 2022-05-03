import { Component } from "../abstracts";
import { createCommentNode } from "./create_coment_node";
import { isPrimitive, isNull, isArray, isObject, forOwn, getObjectLength, promiseResolve } from "../utils";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { emitUpdate } from "./emit_update";
import { emitError } from "./emit_error";
import { Logger } from "./logger";
import { indexOf } from "./index_of";



export function handleForExp(this: Component, key: string, method: (...args) => Promise<HTMLElement>) {
    let cmNode = createCommentNode();
    const els = [cmNode];
    let resolvedValue = this.getState(key);
    if (process.env.NODE_ENV !== 'production') {
        if (isPrimitive(resolvedValue) || isNull(resolvedValue)) {
            new Logger(ERROR_TYPE.ForOnPrimitiveOrNull, key).throwPlain();
        }
    }

    for (const prop in resolvedValue) {
        els.push(
            (method as any)(resolvedValue[prop], prop)
        );
    }
    const isValueArray = isArray(resolvedValue);
    let callBacks = {
        [key]: (newValue, oldValue) => {
            // value resetted
            // runForExp(key, newValue, method);
            const parent = cmNode.parentNode;
            // remove all nodes

            for (let i = 0, len = getObjectLength(oldValue); i < len; i++) {
                parent.removeChild(cmNode.nextSibling);
            }
            // let nextSibling = cmNode.nextSibling;
            // while (nextSibling != null) {
            //     parent.removeChild(nextSibling);
            //     nextSibling = cmNode.nextSibling;
            // }

            // add all node
            if (isArray(newValue)) {
                handleChange('splice', [
                    0, 0, ...newValue
                ]);
            }
            else {
                handleChange("addMany", newValue);
            }
        },
        [`${key}.push`]: (values) => {
            handleChange("splice", [getObjectLength(this.getState(key)) - values.length, 0, ...values]);
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
            const length = getObjectLength(reversedResult);
            handleChange("splice", [0, length, ...reversedResult]);
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
        const indexOfRef = Array.prototype.indexOf.call(parent.childNodes, cmNode);
        (() => {
            switch (methodName) {
                case 'addMany':
                    const fragDoc = document.createDocumentFragment();
                    const promiseList = [];
                    forOwn(params, (prop, value) => {
                        promiseList.push(
                            method(value, prop).then(newElement => {
                                fragDoc.appendChild(newElement);
                            })
                        );
                    });

                    return Promise.all(promiseList).then(_ => {
                        parent.insertBefore(
                            fragDoc, parent.childNodes[indexOfRef + 1]
                        );
                    });
                case 'add':
                    const savedValue = this.getState(key);
                    const length = getObjectLength(savedValue);
                    return method(params.value, params.key).then(newElement => {
                        parent.insertBefore(newElement, parent.childNodes[indexOfRef + length]);
                    });
                case 'splice':
                    // i==1 for comment nodes 
                    const relativeIndex = indexOfRef + params[0];
                    // remove elements
                    for (let i = 1; i <= params[1]; i++) {
                        const child = parent.childNodes[relativeIndex + 1];
                        if (child) {
                            parent.removeChild(child);
                        }
                    }
                    if (!isValueArray) return promiseResolve(null);

                    // add new elements from splice third arguments
                    const promises = [];
                    const frag = document.createDocumentFragment();
                    for (let i = 2, j = params[0], paramLength = params.length; i < paramLength; i++, j++) {
                        promises.push(
                            method(params[i], j).then(newElement => {
                                // parent.insertBefore(newElement, parent.childNodes[indexOfRef + 1 + j]);
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
                        parent.insertBefore(frag, parent.childNodes[indexOfRef + 1 + params[0]]);
                        const spliceRefIndex = indexOfRef + 1 + params[0] + params.length - 2;
                        results[1].forEach((newEl: HTMLElement, elementIndex) => {
                            const el = parent.childNodes[spliceRefIndex + elementIndex];
                            parent.replaceChild(newEl, el);
                        });
                    });
                case 'update':
                    resolvedValue = this.getState(key);
                    const paramKey = params.key;
                    const index = isValueArray ? paramKey : indexOf(resolvedValue, paramKey);
                    if (index >= 0) {
                        return method(params.value, paramKey).then(newElement => {
                            parent.replaceChild(newElement, parent.childNodes[indexOfRef + 1 + index]);
                        });
                    }
                    return promiseResolve(null);
            }
        })().then(_ => {
            emitUpdate(this);
        }).catch(err => {
            emitError.call(this, err);
        });
    };
    this.watch(key, callBacks[key]).
        watch(`${key}.push`, callBacks[`${key}.push`]).
        watch(`${key}.add`, callBacks[`${key}.add`]).
        watch(`${key}.splice`, callBacks[`${key}.splice`]).
        watch(`${key}.update`, callBacks[`${key}.update`]).
        watch(`${key}.delete`, callBacks[`${key}.delete`]).
        watch(`${key}.pop`, callBacks[`${key}.pop`]).
        watch(`${key}.shift`, callBacks[`${key}.shift`]).
        watch(`${key}.unshift`, callBacks[`${key}.unshift`]).
        watch(`${key}.reverse`, callBacks[`${key}.reverse`]);
    return els;
}
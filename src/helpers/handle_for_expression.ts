import { Component } from "../abstracts";
import { createCommentNode } from "./create_coment_node";
import { isPrimitive, isNull, isArray, isObject, forOwn, getObjectLength } from "../utils";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { emitUpdate } from "./emit_update";
import { emitError } from "./emit_error";
import { Logger } from "./logger";
import { indexOf } from "./index_of";

export const runForExp = (key, value, method) => {
    const els: any[] = [];
    if (process.env.NODE_ENV !== 'production') {
        if (isPrimitive(value) || isNull(value)) {
            new Logger(ERROR_TYPE.ForOnPrimitiveOrNull, key).throwPlain();
        }
    }

    if (isArray(value)) {
        value.map((item, i) => {
            els.push(method(item, i));
        });
    }
    else if (isObject(value)) {
        for (const prop in value) {
            els.push(method(value[prop], prop));
        }
    }
    return els;
};

export function handleForExp(this: Component, key: string, method: (...args) => Promise<HTMLElement>) {
    let cmNode = createCommentNode();
    let els = [cmNode];
    let resolvedValue = this.getState(key);
    els = els.concat(runForExp(key, resolvedValue, method));
    const isValueArray = isArray(resolvedValue);
    let callBacks = {
        [key]: (newValue) => {
            // value resetted
            runForExp(key, newValue, method);
            const parent = cmNode.parentNode;
            // remove all nodes

            // for (let i = 0, len = getObjectLength(oldValue); i < len; i++) {
            //     parent.removeChild(cmNode.nextSibling);
            // }
            let nextSibling = cmNode.nextSibling;
            while (nextSibling != null) {
                parent.removeChild(nextSibling);
                nextSibling = cmNode.nextSibling;
            }

            // add all node
            if (isArray(newValue)) {
                callBacks[`${key}.push`](newValue);
            }
            else {
                let index = 0;
                forOwn(newValue, (prop, value) => {
                    index++;
                    handleChange("add", {
                        value,
                        key: prop,
                        length: index + 1
                    });
                });
            }
            emitUpdate(this);
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
    const handleChange = (prop, params) => {
        const parent = cmNode.parentNode;
        const indexOfRef = Array.prototype.indexOf.call(parent.childNodes, cmNode);
        switch (prop) {
            case 'add':
                method(params.value, params.key).then(newElement => {
                    parent.insertBefore(newElement, parent.childNodes[indexOfRef + params.length]);
                }).catch(err => {
                    emitError.call(this, err);
                });
                break;
            case 'splice':
                // i==1 for comment nodes 
                const relativeIndex = indexOfRef + params[0];
                for (let i = 1; i <= params[1]; i++) {
                    const child = parent.childNodes[relativeIndex + 1];
                    if (child) {
                        parent.removeChild(child);
                    }
                }
                const promises = [];
                for (let i = 2, j = params[0], length = params.length; i < length; i++, j++) {
                    promises.push(
                        method(params[i], j).then(newElement => {
                            parent.insertBefore(newElement, parent.childNodes[indexOfRef + 1 + j]);
                        })
                    );
                }

                if (!isValueArray) break;
                const from = (params.length - 2) + params[0];
                // resolvedValue = this.resolve(key);
                const sliced = this.getState(key).slice(from);
                // const asyncElements = runForExp(key, sliced, method);
                Promise.all(promises).then(_ => {
                    return Promise.all(
                        sliced.map((item, itemIndex) => {
                            return method(item, from + itemIndex);
                        })
                    );
                }).then(elements => {
                    const spliceRefIndex = indexOfRef + 1 + params[0] + params.length - 2;
                    elements.forEach((newEl: HTMLElement, elementIndex) => {
                        const el = parent.childNodes[spliceRefIndex + elementIndex];
                        parent.replaceChild(newEl, el);
                    });
                }).catch(err => {
                    emitError.call(this, err);
                });
                break;
            case 'update':
                resolvedValue = this.getState(key);
                const index = isValueArray ? params[0] : indexOf(resolvedValue, params[0]);
                if (index >= 0) {
                    method(params[1], params[0]).then(newElement => {
                        parent.replaceChild(newElement, parent.childNodes[indexOfRef + 1 + index]);
                    }).catch(err => {
                        emitError.call(this, err);
                    });
                }
                break;
        }
        emitUpdate(this);
    };
    this.watch(key, callBacks[key]).
        watch(`${key}.push`, callBacks[`${key}.push`]).
        watch(`${key}.add`, callBacks[`${key}.add`]).
        watch(`${key}.splice`, callBacks[`${key}.splice`]).
        watch(`${key}.update`, callBacks[`${key}.update`]).
        watch(`${key}.pop`, callBacks[`${key}.pop`]).
        watch(`${key}.shift`, callBacks[`${key}.shift`]).
        watch(`${key}.unshift`, callBacks[`${key}.unshift`]).
        watch(`${key}.reverse`, callBacks[`${key}.reverse`]);
    return els;
}
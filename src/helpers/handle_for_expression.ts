import { Component } from "../abstracts";
import { createCommentNode } from "./create_coment_node";
import { Logger, isPrimitive, isNull, isArray, isObject, nextTick, forOwn, indexOf, replaceEl } from "../utils";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { emitUpdate } from "./emit_update";


function runForExp(key, value, method) {
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
}

export function handleForExp(this: Component, key: string, method: (...args) => Promise<HTMLElement>) {
    let cmNode = createCommentNode();
    let els = [cmNode];
    let resolvedValue = this.resolve(key);
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
                newValue.forEach((item, index) => {
                    handleChange("push", {
                        value: item,
                        key: index,
                        length: index + 1
                    });
                });
            }
            else {
                let index = 0;
                forOwn(newValue, (prop, value) => {
                    index++;
                    handleChange("push", {
                        value,
                        key: prop,
                        length: index + 1
                    });
                });
            }
            emitUpdate(this);
        },
        [`${key}.push`]: (newValue) => {
            handleChange("push", newValue);
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
            case 'push':
                method(params.value, params.key).then(newElement => {
                    parent.insertBefore(newElement, parent.childNodes[indexOfRef + params.length]);
                })
                break;
            case 'splice':
                for (let i = 1; i <= params[1]; i++) {
                    const child = parent.childNodes[indexOfRef + params[0] + i];
                    if (child) {
                        parent.removeChild(child)
                    };
                }
                // if (isValueArray) {
                //     Promise.all(
                //         runForExp(key, (this[key] as any[]).slice(params[0]), method)
                //     ).then(childs => {

                //     });
                // }
                let promises = [];
                for (let i = 2, j = params[0], length = params.length; i < length; i++, j++) {
                    // promises.push(method(params[i], j));
                    promises.push(
                        new Promise(res => {
                            method(params[i], j).then(newElement => {
                                parent.insertBefore(newElement, parent.childNodes[indexOfRef + 1 + j]);
                                res();
                            })
                        })
                    )
                };

                if (!isValueArray) return;
                const from = (params.length - 2) + params[0];
                // resolvedValue = this.resolve(key);
                const sliced = this.resolve(key).slice(from);
                // const asyncElements = runForExp(key, sliced, method);
                Promise.all(promises).then(_ => {
                    return Promise.all(
                        sliced.map((item, index) => {
                            return method(item, from + index);
                        })
                    );
                }).then(elements => {
                    const spliceRefIndex = indexOfRef + 1 + params[0] + params.length - 2;
                    elements.forEach((newEl: HTMLElement, index) => {
                        const el = parent.childNodes[spliceRefIndex + index]
                        console.log("el", el);
                        parent.replaceChild(newEl, el);
                    })

                })
                // if (params[2]) {

                //     method(params[2], params[0]).then(newElement => {
                //         parent.insertBefore(newElement, parent.childNodes[indexOfRef + 1 + params[0]]);
                //     })
                // }
                break;
            case 'update':
                resolvedValue = this.resolve(key);
                const index = indexOf(resolvedValue, params[0]);
                if (index >= 0) {
                    method(params[1], params[0]).then(newElement => {
                        parent.replaceChild(newElement, parent.childNodes[indexOfRef + 1 + index]);
                    })
                }
                break;
        }
        emitUpdate(this);
    };
    this.watch(key, callBacks[key]).
        watch(`${key}.push`, callBacks[`${key}.push`]).
        watch(`${key}.splice`, callBacks[`${key}.splice`]).
        watch(`${key}.update`, callBacks[`${key}.update`]);
    return els;
}
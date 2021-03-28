import { Component } from "../abstracts";
import { createCommentNode } from "./create_coment_node";
import { Logger, isPrimitive, isNull, isArray, isObject, nextTick, forOwn, indexOf } from "../utils";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";


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
            //add setter
            if (isObject(newValue)) {
                (this as any).observer_.create(newValue, null, `${key}.`);
            }
        },
        [`${key}.push`]: (_, oldValue) => {
            handleChange("push", oldValue);
        },
        [`${key}.splice`]: (_, oldValue) => {
            handleChange("splice", oldValue);
        },
        [`${key}.update`]: (_, oldValue) => {
            handleChange("update", oldValue);
        }
    };
    const onElDestroyed = () => {
        cmNode.removeEventListener(LIFECYCLE_EVENT.Destroyed, onElDestroyed);
        cmNode = null;
        for (const ev in callBacks) {
            this.unwatch(ev, callBacks[ev]);
        }
        callBacks = null;
    };
    cmNode.addEventListener(LIFECYCLE_EVENT.Destroyed, onElDestroyed);
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
                    parent.removeChild(parent.childNodes[indexOfRef + params[0] + i]);
                }
                if (params[2]) {
                    method(params[2], params[0]).then(newElement => {
                        parent.insertBefore(newElement, parent.childNodes[indexOfRef + 1 + params[0]]);
                    })
                }
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
    };
    this.watch(key, callBacks[key]).
        watch(`${key}.push`, callBacks[`${key}.push`]).
        watch(`${key}.splice`, callBacks[`${key}.splice`]).
        watch(`${key}.update`, callBacks[`${key}.update`]);
    return els;
}
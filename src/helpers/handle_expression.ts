import { LIFECYCLE_EVENT } from "../enums";
import { nextTick, replaceEl } from "../utils";
import { Component } from "../abstracts";
import { handleForExp } from "./handle_for_expression";
import { emitUpdate } from "./emit_update";

export function handleExpression(this: Component, method: () => Promise<HTMLElement>, keys: string[], type?: string) {
    if (type === "for") {
        return handleForExp.call(this, keys[0], method);
    }
    return new Promise((res) => {
        method().then(el => {
            let changesQueue = [];
            const handleChange = () => {
                changesQueue.shift();
                const onChange = () => {
                    nextTick(() => {
                        method().then(newEl => {
                            replaceEl(el, newEl);
                            el = newEl;
                            handleChange();
                        })
                    })
                };
                const watchCallBack = () => {
                    changesQueue.push(1);
                    if (changesQueue.length === 1) {
                        onChange();
                    }
                };
                keys.forEach(item => {
                    this.watch(item, watchCallBack);
                });
                const onElDestroyed = function () {
                    el.removeEventListener(LIFECYCLE_EVENT.Destroy, onElDestroyed);
                    keys.forEach(item => {
                        this.unwatch(item, watchCallBack);
                    });
                }.bind(this);
                el.addEventListener(LIFECYCLE_EVENT.Destroy, onElDestroyed);
                if (changesQueue.length > 0) {
                    onChange();
                }
                emitUpdate(this);
            };
            handleChange();
            res(el);
        });
    })

}

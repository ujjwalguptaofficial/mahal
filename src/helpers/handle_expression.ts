import { LIFECYCLE_EVENT } from "../enums";
import { nextTick, replaceEl } from "../utils";
import { Component } from "../abstracts";
import { handleForExp } from "./handle_for_expression";
import { emitUpdate } from "./emit_update";
import { emitError } from "./emit_error";
import { EL_REPLACED } from "../constant";

export function handleExpression(this: Component, method: () => HTMLElement, keys: string[], type?: string) {
    if (type === "for") {
        return handleForExp.call(this, keys[0], method);
    }
    let el = method();
    const changesQueue = [];
    const handleChange = () => {
        changesQueue.shift();
        const onChange = () => {
            nextTick(() => {
                try {
                    const newEl = method();
                    replaceEl(el, newEl);
                    el = newEl;
                    handleChange();
                } catch (err) {
                    emitError.call(this, err);
                }
            });
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
            // el.removeEventListener(LIFECYCLE_EVENT.Destroy, onElDestroyed);
            keys.forEach(item => {
                this.unwatch(item, watchCallBack);
            });
            const replacedEl = el[EL_REPLACED];
            if (replacedEl) {
                el = replacedEl;
                handleChange();
            }
            // else {
            //     el = null;
            // }
        }.bind(this);
        el.addEventListener(LIFECYCLE_EVENT.Destroy, onElDestroyed);
        if (changesQueue.length > 0) {
            onChange();
        }
        emitUpdate(this);
    };
    handleChange();
    return el;
}

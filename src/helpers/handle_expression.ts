import { replaceEl } from "../utils";
import { Component } from "../abstracts";
import { handleForExp } from "./handle_for_expression";
import { emitUpdate } from "./emit_update";
import { emitError } from "./emit_error";
import { EL_REPLACED } from "../constant";
import { onElDestroy, subscriveToDestroyFromChild } from "../helpers";

export function handleExpression(this: Component, method: () => HTMLElement, keys: string[], type: string, forVarInfo) {
    if (type === "for") {
        return handleForExp.call(this, keys[0], method, forVarInfo);
    }
    let el = method();
    if (keys.length === 0) return el;
    const changesQueue = [];
    subscriveToDestroyFromChild(el);
    const handleChange = () => {
        changesQueue.shift();
        const onChange = () => {
            try {
                const newEl = method();
                subscriveToDestroyFromChild(newEl);
                replaceEl(el, newEl);
            } catch (err) {
                emitError.call(this, err);
            }
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
        const onElDestroyed = () => {
            keys.forEach((item) => {
                this.unwatch(item, watchCallBack);
            });
            const replacedEl = el[EL_REPLACED];
            if (replacedEl) {
                el = replacedEl;
                handleChange();
            }
        };
        onElDestroy(el, onElDestroyed);
        if (changesQueue.length > 0) {
            onChange();
        }
        emitUpdate(this);
    };
    handleChange();
    return el;
}

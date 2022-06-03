import { LIFECYCLE_EVENT } from "../enums";
import { nextTick, replaceEl } from "../utils";
import { Component } from "../abstracts";
import { handleForExp } from "./handle_for_expression";
import { emitUpdate } from "./emit_update";
import { emitError } from "./emit_error";
import { EL_REPLACED } from "../constant";
import { onElDestroy } from "./on_el_destroy";

export function handleExpression(this: Component, method: () => HTMLElement, keys: string[], type?: string) {
    if (type === "for") {
        return handleForExp.call(this, keys[0], method);
    }
    let el = method();
    const changesQueue = [];
    const handleChange = () => {
        changesQueue.shift();
        const onChange = () => {
            try {
                const newEl = method();
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

        const keysId = keys.map(item => {
            return this.watch(item, watchCallBack);
        });
        const onElDestroyed = () => {
            nextTick(_ => {
                keys.forEach((item, index) => {
                    this.unwatch(item, keysId[index]);
                });
                const replacedEl = el[EL_REPLACED];
                if (replacedEl) {
                    el = replacedEl;
                    handleChange();
                }
            });
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

import { replaceEl } from "../utils";
import { Component } from "../abstracts";
import { handleForExp } from "./handle_for_expression";
import { emitUpdate } from "./emit_update";
import { emitError } from "./emit_error";
import { EL_REPLACED } from "../constant";
import { onElDestroy, subscriveToDestroyFromChild } from "../helpers";

export function handleExpression(this: Component, method: () => HTMLElement, keys: string[], type: string) {
    const ctx = this;
    if (type === "for") {
        return handleForExp.call(ctx, keys[0], method);
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
                const isPatched = replaceEl(el, newEl);
                if (isPatched) {
                    changesQueue.shift();
                    emitUpdate(ctx);
                }
                else {
                    subscriveToDestroyFromChild(newEl);
                    newEl['_setVal_'] = el['_setVal_'];
                }
            } catch (err) {
                emitError.call(ctx, err);
            }
        };
        const watchCallBack = () => {
            changesQueue.push(1);
            if (changesQueue.length === 1) {
                onChange();
            }
        };

        keys.forEach(item => {
            ctx.watch(item, watchCallBack);
        });
        const onElDestroyed = () => {
            keys.forEach((item) => {
                ctx.unwatch(item, watchCallBack);
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
        emitUpdate(ctx);
    };
    handleChange();
    return el;
}

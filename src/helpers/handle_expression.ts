import { LIFECYCLE_EVENT } from "../enums";
import { getReplacedBy } from "./get_replaced_by";
import { nextTick, replaceEl } from "../utils";
import { Component } from "../abstracts";
import { handleForExp } from "./handle_for_expression";

export function handleExpression(this: Component, method: Function, keys: string[], type?: string) {
    if (type === "for") {
        return handleForExp.call(this, keys[0], method);
    }
    let el = method();
    let changesQueue = [];
    const handleChange = function () {
        el.removeEventListener(LIFECYCLE_EVENT.Rendered, handleChange);
        el = getReplacedBy(el);
        changesQueue.shift();
        const onChange = () => {
            nextTick(() => {
                const newEl = method();
                replaceEl(el, newEl);
                el = newEl;
                el.addEventListener(LIFECYCLE_EVENT.Rendered, handleChange);
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
            el.removeEventListener(LIFECYCLE_EVENT.Destroyed, onElDestroyed);
            keys.forEach(item => {
                this.unwatch(item, watchCallBack);
            });
        }.bind(this);
        el.addEventListener(LIFECYCLE_EVENT.Destroyed, onElDestroyed);
        if (changesQueue.length > 0) {
            onChange();
        }
    }.bind(this);
    el.addEventListener(LIFECYCLE_EVENT.Rendered, handleChange);
    return el;
}

import { LIFECYCLE_EVENT } from "../enums";
import { getReplacedBy } from "./get_replaced_by";
import { nextTick, replaceEl } from "../utils";
import { Component } from "../abstracts";
import { handleForExp } from "./handle_for_expression";
import { replacedBy } from "../constant";

export function handleExpression(this: Component, method: Function, keys: string[], type?: string) {
    if (type === "for") {
        return handleForExp.call(this, keys[0], method);
    }
    let el = method();
    let changesQueue = [];
    const handleChange = () => {
        el.removeEventListener(replacedBy, handleChange);
        el = getReplacedBy(el);
        changesQueue.shift();
        const onChange = () => {
            nextTick(() => {
                const newEl = method();
                replaceEl(el, newEl);
                el = newEl;
                if (el.isComponent) {
                    el.addEventListener(replacedBy, handleChange);
                }
                else {
                    handleChange();
                }
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
        if (this.isMounted) {
            this.emit(LIFECYCLE_EVENT.Update);
        }
    };
    if (el.isComponent) {
        el.addEventListener(replacedBy, handleChange);
    }
    else {
        handleChange();
    }
    return el;
}

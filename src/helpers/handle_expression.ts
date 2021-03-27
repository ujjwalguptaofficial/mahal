import { LIFECYCLE_EVENT } from "../enums";
import { getReplacedBy } from "./get_replaced_by";
import { nextTick, replaceEl, Timer } from "../utils";
import { Component } from "../abstracts";
import { handleForExp } from "./handle_for_expression";
import { replacedBy } from "../constant";
import { createElement } from "./create_element";

export function handleExpression(this: Component, method: () => Promise<HTMLElement>, keys: string[], type?: string) {
    if (type === "for") {
        const res = handleForExp.call(this, keys[0], method);
        return res;
    }
    return new Promise((res) => {
        method().then(el => {
            let changesQueue = [];
            const handleChange = () => {
                el.removeEventListener(replacedBy, handleChange);
                el = getReplacedBy(el);
                changesQueue.shift();
                const onChange = () => {
                    nextTick(async () => {
                        const newEl = await method();
                        replaceEl(el, newEl);
                        el = newEl;
                        handleChange();
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
                    this._timer_.debounce(() => {
                        this.emit(LIFECYCLE_EVENT.Update);
                    })
                }
            };
            handleChange();
            res(el);
        });
    })

}

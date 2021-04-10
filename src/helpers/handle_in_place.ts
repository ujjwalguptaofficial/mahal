import { Component } from "../abstracts";
import { createCommentNode } from "./create_coment_node";
import { replaceEl } from "../utils";
import { createElement } from "./create_element";
import { emitUpdate } from "./emit_update";
import { handleExpression } from "./handle_expression";

export function handleInPlace(this: Component, childs, option) {
    const of = option.attr.of;
    if (!of) return createCommentNode();
    delete option.attr.of;
    const key = of.k;
    return handleExpression.call(this, () => {
        return createElement.call(this, this.resolve(key), childs, option);
    }, key ? [key] : []);
    let elPromise: Promise<HTMLElement> = createElement.call(this, of.v, childs, option);
    if (key) {
        elPromise.then(el => {
            const watchCallBack = (val) => {
                createElement.call(this, val, childs, option).then(newEl => {
                    replaceEl(el, newEl);
                    el = newEl;
                    emitUpdate(this);
                })
            };

            if (!this['_inPlaceWatchers'][key]) {
                this.watch(key, watchCallBack);
                this['_inPlaceWatchers'][key] = true;
            }
        })
    }
    return elPromise;
}
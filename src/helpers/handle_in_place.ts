import { Component } from "../abstracts";
import { createCommentNode } from "./create_coment_node";
import { replaceEl } from "../utils";
import { createElement } from "./create_element";

export function handleInPlace(this: Component, childs, option) {
    const attr = option.attr.of;
    if (!attr) return createCommentNode();
    delete option.attr.of;
    let elPromise: Promise<HTMLElement> = createElement.call(this, attr.v, childs, option);
    const key = attr.k;
    if (key) {
        elPromise.then(el => {
            const watchCallBack = (val) => {
                createElement.call(this, val, childs, option).then(newEl => {
                    replaceEl(el, newEl);
                    el = newEl;
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
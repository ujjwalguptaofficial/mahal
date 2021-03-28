import { Component } from "../abstracts";
import { createCommentNode } from "./create_coment_node";
import { replaceEl } from "../utils";
import { LIFECYCLE_EVENT } from "../enums";
import { getReplacedBy } from "./get_replaced_by";
import { createElement } from "./create_element";
import { replacedBy } from "../constant";

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

            if (!(this as any).inPlaceWatchers[key]) {
                this.watch(key, watchCallBack);
                this['inPlaceWatchers'][key] = true;
            }
        })
    }
    return elPromise;
}
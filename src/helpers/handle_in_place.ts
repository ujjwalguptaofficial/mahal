import { Component } from "../abstracts";
import { createCommentNode } from "./create_coment_node";
import { replaceEl } from "../utils";
import { LIFECYCLE_EVENT } from "../enums";
import { getReplacedBy } from "./get_replaced_by";
import { createElement } from "./create_element";

export function handleInPlace(this: Component, childs, option) {
    const attr = option.attr.of;
    if (!attr) return createCommentNode();
    delete option.attr.of;
    let el: HTMLElement = createElement.call(this, attr.v, childs, option);
    const key = attr.k;
    if (key) {
        const watchCallBack = (val) => {
            const newEl = createElement.call(this, val, childs, option);
            replaceEl(el, newEl);
            el = newEl;
            checkForRendered();
        };
        const checkForRendered = () => {
            const onElementRendered = () => {
                el.removeEventListener(LIFECYCLE_EVENT.Rendered, onElementRendered);
                el = getReplacedBy(el);
            }
            el.addEventListener(LIFECYCLE_EVENT.Rendered, onElementRendered);
        };
        checkForRendered();
        if (!(this as any).inPlaceWatchers[key]) {
            this.watch(key, watchCallBack);
            (this as any).inPlaceWatchers[key] = true;
        }
    }
    return el;
}
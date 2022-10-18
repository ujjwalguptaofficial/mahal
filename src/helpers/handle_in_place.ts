import { Component } from "../abstracts";
import { IElementOption } from "../interface";
import { createCommentNode } from "./create_coment_node";
import { createElement } from "./create_element";

export function handleInPlace(this: Component, childs, option: IElementOption) {
    const of = option.rAttr?.of;
    if (process.env.NODE_ENV !== 'production' && !of && option.attr?.of) {
        console.warn('Found "of" value as constant, please use component state for setting "of" attribute');
    }
    if (!of) return createCommentNode();
    delete option.rAttr.of;
    const keys = of.k;
    return this['_handleExp_'](() => {
        return createElement.call(this, (of as any).v, childs, option) as HTMLElement;
    }, keys);
}
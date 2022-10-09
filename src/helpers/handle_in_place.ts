import { Component } from "../abstracts";
import { IElementOption } from "../interface";
import { createCommentNode } from "./create_coment_node";
import { createElement } from "./create_element";

export function handleInPlace(this: Component, childs, option: IElementOption) {
    const of = option.rAttr?.of || option.attr?.of;
    if (!of) return createCommentNode();
    delete option.attr.of;
    const key = (of as any).k;
    return this['_handleExp_'](() => {
        return createElement.call(this, this.getState(key), childs, option) as HTMLElement;
    }, key ? [key] : []);
}
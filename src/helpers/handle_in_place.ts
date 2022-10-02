import { Component } from "../abstracts";
import { createCommentNode } from "./create_coment_node";

export function handleInPlace(this: Component, childs, option) {
    const of = option.attr.of;
    if (!of) return createCommentNode();
    delete option.attr.of;
    const key = of.k;
    return this['_handleExp_'](() => {
        return this['_createEl_'](this.getState(key), childs, option) as HTMLElement;
    }, key ? [key] : []);
}
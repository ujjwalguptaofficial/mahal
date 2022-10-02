import { Component } from "../abstracts";
import { createCommentNode } from "./create_coment_node";
import { handleExpression } from "./handle_expression";

export function handleInPlace(this: Component, childs, option) {
    const of = option.attr.of;
    if (!of) return createCommentNode();
    delete option.attr.of;
    const key = of.k;
    return handleExpression.call(this, () => {
        return this['_createEl_'](this.getState(key), childs, option);
    }, key ? [key] : []);
}
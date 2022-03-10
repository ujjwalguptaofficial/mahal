import { Component } from "../abstracts";
import { createCommentNode } from "./create_coment_node";
import { createElement } from "./create_element";
import { handleExpression } from "./handle_expression";

export function handleInPlace(this: Component, childs, option) {
    const of = option.attr.of;
    if (!of) return createCommentNode();
    delete option.attr.of;
    const key = of.k;
    return handleExpression.call(this, () => {
        return createElement.call(this, this.getState(key), childs, option);
    }, key ? [key] : []);
}
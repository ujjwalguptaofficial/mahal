import { Component } from "../abstracts";
import { emitRender } from "./emit_render";

export function createTextNode(this: Component, val) {
    var el = document.createTextNode(val);
    emitRender(el as any);
    return el;
}
import { Component } from "../abstracts";
import { emitReplacedBy } from "./emit_render";

export function createTextNode(this: Component, val) {
    var el = document.createTextNode(val);
    emitReplacedBy.call(this, el as any);
    return el;
}
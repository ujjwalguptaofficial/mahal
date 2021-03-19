import { Component } from "../abstracts";

export function createTextNode(this: Component, val) {
    var el = document.createTextNode(val);
    this.emitRender_(el as any);
    return el;
}
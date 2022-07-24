import { Component } from "../abstracts";

export function createTextNode(this: Component, val) {
    return document.createTextNode(val);
}
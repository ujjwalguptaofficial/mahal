import { Component } from "../abstracts";
import { promiseResolve } from "../utils";

export function createTextNode(this: Component, val) {
    return document.createTextNode(val);
}
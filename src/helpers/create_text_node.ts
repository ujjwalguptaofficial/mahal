import { Component } from "../abstracts";
import { promiseResolve } from "../utils";

export function createTextNode(this: Component, val) {
    return promiseResolve(
        document.createTextNode(val)
    );
}
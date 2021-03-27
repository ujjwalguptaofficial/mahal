import { Component } from "../abstracts";

export function createTextNode(this: Component, val) {
    return Promise.resolve(
        document.createTextNode(val)
    );
}
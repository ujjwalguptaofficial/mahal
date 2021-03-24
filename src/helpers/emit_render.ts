import { nextTick } from "../utils";
import { replacedBy } from "../constant";
import { Component } from "../abstracts";

const renderEvent = new window.CustomEvent(replacedBy);
export function emitReplacedBy(this: Component, element: HTMLElement) {
    nextTick(_ => {
        element.dispatchEvent(renderEvent);
    });
}
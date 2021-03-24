import { nextTick } from "../utils";
import { replacedBy } from "../constant";
import { Component } from "../abstracts";
import { LIFECYCLE_EVENT } from "../enums";

const renderEvent = new window.CustomEvent(replacedBy);
export function emitReplacedBy(this: Component, element: HTMLElement) {
    nextTick(_ => {
        element.dispatchEvent(renderEvent);
        // nextTick(() => {
        //     this.emit(LIFECYCLE_EVENT.Update);
        // })
    });
}
import { Component } from "../abstracts";
import { LIFECYCLE_EVENT } from "../enums";

export function emitComponentRender(component: Component) {
    component.emit(LIFECYCLE_EVENT.Rendered);
    component.isMounted = true;
}
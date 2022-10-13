import { Component } from "../abstracts";
import { LIFECYCLE_EVENT } from "../enums";

export const setComponentMount = (component: Component, el: HTMLElement) => {
    component.element = el;
    component.isMounted = true;
    component.emit(LIFECYCLE_EVENT.Mount);
};
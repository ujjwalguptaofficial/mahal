import { Component } from "../abstracts";
import { EL_REPLACED } from "../constant";
import { dispatchDestroyed } from "../helpers";

export function replaceElWithCtx(component: Component, oldEl: HTMLElement, newEl: HTMLElement) {
    if (oldEl === component.element) {
        component.element = newEl;
        const appComponent = component['_app_'].component;

        // update app element when element matched with mounted element 
        if (appComponent.element === oldEl) {
            appComponent.element = newEl;
        }
    }
    return replaceEl(oldEl, newEl);
}

export const replaceEl = (oldEl: HTMLElement, newEl: HTMLElement) => {
    const nodeType = oldEl.nodeType;
    if (nodeType === 3 && newEl.nodeType === nodeType) {
        oldEl.nodeValue = newEl.nodeValue;
        return true;
    }
    oldEl[EL_REPLACED] = newEl;
    dispatchDestroyed(oldEl);
    oldEl.replaceWith(newEl);
};

export const removeEl = (el: Element) => {
    dispatchDestroyed(el);
    el.remove();
};

export const insertBefore = (parent: Element, nodeToInsert: Node, relativeNode: Node) => {
    parent.insertBefore(
        nodeToInsert, relativeNode
    );
};

export const addEventListener = (el: Element, event: string, eventListener: Function, option?: any) => {
    el.addEventListener(event, eventListener as any, option);
};

export const createDocumentFragment = () => {
    return document.createDocumentFragment();
};

export const findElement = (el: Element, query: string) => {
    return el.querySelector(query);
};
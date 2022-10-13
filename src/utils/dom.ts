import { EL_REPLACED } from "../constant";
import { dispatchDestroyed } from "../helpers";

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
}
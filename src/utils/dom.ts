import { EL_REPLACED } from "../constant";
import { dispatchDestroyed } from "../helpers";

export const replaceEl = (oldEl: HTMLElement, newEl: HTMLElement) => {
    oldEl[EL_REPLACED] = newEl;
    dispatchDestroyed(oldEl);
    oldEl.replaceWith(newEl);
};
export const removeEl = (el: Element) => {
    dispatchDestroyed(el);
    el.remove();
};

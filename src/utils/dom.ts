import { dispatchDestroyed } from "../helpers";

export const replaceEl = (oldEl: HTMLElement, newEl: HTMLElement) => {
    dispatchDestroyed(oldEl);
    oldEl.replaceWith(newEl);
};
export const removeEl = (el: Element) => {
    dispatchDestroyed(el);
    el.remove();
};

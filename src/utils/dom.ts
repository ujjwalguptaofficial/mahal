export const replaceEl = (oldEl: HTMLElement, newEl: HTMLElement) => {
    oldEl.replaceWith(newEl);
    // dispatchDestroyed(oldEl);
};
export const removeEl = (el: Element) => {
    el.remove();
    // dispatchDestroyed(el);
};

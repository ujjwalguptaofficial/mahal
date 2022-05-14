// export const destroyEl = (el: HTMLElement) => {

// }

export const replaceEl = (oldEl: HTMLElement, newEl: HTMLElement) => {
    oldEl.parentNode.replaceChild(newEl, oldEl);
};
export const removeEl = (el: HTMLElement) => {
    el.remove();    
    
};
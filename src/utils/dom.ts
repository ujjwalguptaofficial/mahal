// export const destroyEl = (el: HTMLElement) => {

// }

export const replaceEl = (oldEl: HTMLElement | Comment, newEl: HTMLElement | Comment) => {
    oldEl.parentNode.replaceChild(newEl, oldEl);
};
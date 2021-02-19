export const nextTick = window.queueMicrotask || ((cb: Function) => {
    setTimeout(cb, 0);
});
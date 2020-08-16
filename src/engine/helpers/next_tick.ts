export const nextTick = queueMicrotask || ((cb: Function) => {
    setTimeout(cb, 10)
});
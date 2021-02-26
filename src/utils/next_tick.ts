let isExecuting = false;
let callbacks = [];
const microTaskExecutor = window.queueMicrotask || ((cb: Function) => {
    setTimeout(cb, 0);
});
const flushCallbacks = () => {
    microTaskExecutor(() => {
        const copies = callbacks.slice(0);
        callbacks = [];
        isExecuting = false;
        copies.forEach(cb => {
            cb();
        });
    });
};
export const nextTick = (cb: Function) => {
    callbacks.push(cb);
    if (!isExecuting) {
        isExecuting = true;
        flushCallbacks();
    }
}
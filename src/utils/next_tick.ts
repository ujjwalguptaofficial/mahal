let isExecuting = false;
let callbacks = new Map<number, Function>();

const microTaskExecutor = window.queueMicrotask || ((cb: Function) => {
    setTimeout(cb, 0);
});

const flushCallbacks = () => {
    microTaskExecutor(() => {
        const copies = callbacks;
        callbacks = new Map();
        isExecuting = false;
        copies.forEach(cb => {
            cb();
        });
    });
};
export const nextTick = (cb?: Function): number => {
    const id = callbacks.size;
    callbacks.set(id, cb);
    if (!isExecuting) {
        isExecuting = true;
        flushCallbacks();
    }
    return id;
};

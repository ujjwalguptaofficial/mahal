let isExecuting = false;
let callbacks = [];
const microTaskExecutor = window.queueMicrotask || ((cb: Function) => {
    setTimeout(cb, 0);
});
let lowPrioTasks = [];

const flushLowPrioTasks = () => {
    microTaskExecutor(() => {
        const copies = lowPrioTasks.slice(0);
        lowPrioTasks = [];
        copies.forEach(cb => {
            cb();
        });
    });
};

const flushCallbacks = () => {
    microTaskExecutor(() => {
        const copies = callbacks.slice(0);
        callbacks = [];
        copies.forEach(cb => {
            cb();
        });
        isExecuting = false;
        if (callbacks.length > 0) {
            flushCallbacks();
        }
        else {
            flushLowPrioTasks();
        }
    });
};

export const queueLowPrioTask = (cb: Function) => {
    lowPrioTasks.push(cb);
    if (callbacks.length === 0) flushLowPrioTasks();
}

export const nextTick = (cb?: Function): Promise<void> | void => {
    let promise: Promise<void>;
    if (cb == null) {
        promise = new Promise((res) => {
            cb = res;
        });
    }
    callbacks.push(cb);
    if (!isExecuting) {
        isExecuting = true;
        flushCallbacks();
    }
    // if (promise) {
    return promise;
    // }
};
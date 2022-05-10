import { FALSE, TRUE } from "../constant";

let isExecuting = FALSE;
let callbacks = [];
const microTaskExecutor = window.queueMicrotask || ((cb: Function) => {
    setTimeout(cb, 0);
});
const flushCallbacks = () => {
    microTaskExecutor(() => {
        const copies = callbacks.slice(0);
        callbacks = [];
        isExecuting = FALSE;
        copies.forEach(cb => {
            cb();
        });
    });
};
export const nextTick = (cb?: Function): Promise<void> | void => {
    let promise: Promise<void>;
    if (cb == null) {
        promise = new Promise((res) => {
            cb = res;
        });
    }
    callbacks.push(cb);
    if (!isExecuting) {
        isExecuting = TRUE;
        flushCallbacks();
    }
    if (promise) {
        return promise;
    }
};
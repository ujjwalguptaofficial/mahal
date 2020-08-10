(window as any).queueMicrotask = queueMicrotask || ((cb: Function) => {
    setTimeout(cb, 10)
});
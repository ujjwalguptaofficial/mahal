
export const onElDestroy = function (el: HTMLElement | Comment, cb: () => void) {
    let evs = el['__destroyev__'];
    if (!evs) {
        el['__destroyev__'] = [cb]
    }
    else {
        evs.push(cb);
    }
    // (el as any).onDestroy = true;
    // el.addEventListener(LIFECYCLE_EVENT.Destroy, cb);
    // evBus.on('')
};
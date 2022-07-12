import { nextTick } from "../utils";

export const DESTROYED_EVENTS = '__destroyEvents__';
export const ON_DESTROY = "__onDestroy__";

const setElementDestroy = (el: HTMLElement) => {
    el[ON_DESTROY] = true;
}

export const onElDestroy = (el: HTMLElement | Comment, cb: () => void) => {
    nextTick(_ => {
        setElementDestroy(el as HTMLElement);
        const parentElement = el.parentElement;
        if (parentElement && !parentElement[ON_DESTROY]) {
            setElementDestroy(parentElement);
        }
        let evs = el[DESTROYED_EVENTS];
        if (!evs) {
            el[DESTROYED_EVENTS] = evs = [];
        }
        evs.push(cb);
    })
};

const dispatchDestroyedEv = (node: Node) => {
    if (!node[ON_DESTROY]) return;
    node.childNodes.forEach(item => {
        dispatchDestroyedEv(item);
    });
    let evs: Function[] = node[DESTROYED_EVENTS];
    if (evs) {
        evs.forEach(ev => {
            ev();
        })
    }
};

export const dispatchDestroyed = (node: Node) => {
    nextTick(_ => {
        dispatchDestroyedEv(node);
    });
};
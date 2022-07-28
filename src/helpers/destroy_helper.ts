import { nextTick } from "../utils";

const DESTROYED_EVENTS = '__destroyEvents__';


export const onElDestroy = (el: HTMLElement | Comment, cb: () => void) => {
    nextTick(_ => {
        let evs = el[DESTROYED_EVENTS];
        if (!evs) {
            el[DESTROYED_EVENTS] = evs = [];
        }
        evs.push(cb);
    });
};

const dispatchDestroyedEv = function (node: Node) {
    const evs: Function[] = node[DESTROYED_EVENTS];
    if (evs) {
        evs.forEach(ev => {
            ev();
        });
        if (node['_comp_destroyed_']) return;
    }
    node.childNodes.forEach(item => {
        dispatchDestroyedEv(item);
    });
};

export const dispatchDestroyed = function (node: Node) {
    nextTick(_ => {
        dispatchDestroyedEv(node);
    });
};
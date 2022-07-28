import { CHILD_DESTROY, EMIT_DESTROY } from "../constant";
import { nextTick } from "../utils";

const DESTROYED_EVENTS = '__destroyEvents__';


export const onElDestroy = (el: HTMLElement | Comment, cb: () => void) => {
    nextTick(_ => {
        let evs = el[DESTROYED_EVENTS];
        if (!evs) {
            el[DESTROYED_EVENTS] = evs = [];
        }
        evs.push(cb);
        el.dispatchEvent(
            new CustomEvent(CHILD_DESTROY, {
                bubbles: true
            })
        )
    });
};

const dispatchDestroyedEv = function (node: Node, shouldEmitToChildren?) {
    const evs: Function[] = node[DESTROYED_EVENTS];
    if (evs) {
        evs.forEach(ev => {
            ev();
        });
        if (node['_comp_destroyed_']) return;
    }
    if (shouldEmitToChildren) {
        node.childNodes.forEach(item => {
            dispatchDestroyedEv(item, true);
        });
    }
};

export const dispatchDestroyed = function (node: Node) {
    nextTick(_ => {
        dispatchDestroyedEv(node,
            node[EMIT_DESTROY]
        );
    });
};
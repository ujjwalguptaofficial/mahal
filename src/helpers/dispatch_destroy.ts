import { LIFECYCLE_EVENT } from "../enums";
import { nextTick } from "../utils";
const destroyedEvent = new window.CustomEvent(LIFECYCLE_EVENT.Destroy);

const dispatchDestroyedEv = (node: Node) => {
    node.childNodes.forEach(item => {
        dispatchDestroyedEv(item);
    });
    if ((node as any).onDestroy) {
        node.dispatchEvent(destroyedEvent);
    }
};

export const dispatchDestroyed = (node: Node) => {
    nextTick(() => {
        dispatchDestroyedEv(node);
    });
};
import { LIFECYCLE_EVENT } from "../enums";
import { nextTick } from "../utils";

const dispatchDestroyedEv = (node: Node) => {
    node.childNodes.forEach(item => {
        dispatchDestroyedEv(item);
    });
    if ((node as any).onDestroy) {
        nextTick(_ => {
            node.dispatchEvent(new window.CustomEvent(LIFECYCLE_EVENT.Destroy));
        });
    }

};

export const dispatchDestroyed = (node: Node) => {
    nextTick(_ => {
        dispatchDestroyedEv(node);
    });
};
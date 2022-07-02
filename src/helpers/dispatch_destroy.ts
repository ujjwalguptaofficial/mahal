import { LIFECYCLE_EVENT } from "../enums";
import { queueLowPrioTask } from "../utils";

const dispatchDestroyedEv = (node: Node) => {
    node.childNodes.forEach(item => {
        dispatchDestroyedEv(item);
    });
    if ((node as any).onDestroy) {
        queueLowPrioTask(_ => {
            node.dispatchEvent(new window.CustomEvent(LIFECYCLE_EVENT.Destroy));
        });
    }

};

export const dispatchDestroyed = (node: Node) => {
    queueLowPrioTask(_ => {
        dispatchDestroyedEv(node);
    });
};
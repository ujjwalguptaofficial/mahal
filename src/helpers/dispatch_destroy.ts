import { nextTick } from "../utils";

export const dispatchDestroyed = (node: Node) => {
    node.childNodes.forEach(dispatchDestroyed);
    const destroyEvs = (node as any).__destroyev__;
    if (destroyEvs) {
        nextTick(_ => {
            // node.dispatchEvent(new window.CustomEvent(LIFECYCLE_EVENT.Destroy));
            destroyEvs.forEach(ev => {
                ev();
            });
        });
    }
};
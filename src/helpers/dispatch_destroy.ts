import { LIFECYCLE_EVENT } from "../enums";
const destroyedEvent = new window.CustomEvent(LIFECYCLE_EVENT.Destroy);

export const dispatchDestroyed = (node: Node) => {
    node.dispatchEvent(destroyedEvent);
    node.childNodes.forEach(item => {
        dispatchDestroyed(item);
    });
};
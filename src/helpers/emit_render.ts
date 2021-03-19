import { nextTick } from "../utils";
import { LIFECYCLE_EVENT } from "../enums";

const renderEvent = new window.CustomEvent(LIFECYCLE_EVENT.Rendered);
export function emitRender(element: HTMLElement) {
    nextTick(() => {
        element.dispatchEvent(renderEvent);
    })
}
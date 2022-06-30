import morphdom from "morphdom";
import { EVENTS } from "../constant";
import { dispatchDestroyed } from "../helpers";

export const patchNode = (currentEl: HTMLElement, newElement: HTMLElement) => {
    morphdom(currentEl, newElement, {
        onBeforeElUpdated(fromEl, toEl) {
            if (fromEl.isEqualNode(toEl)) {
                return false;
            }
            const fromEvs: Map<string, Function> = fromEl[EVENTS];
            if (fromEvs) {
                fromEvs.forEach((ev, name) => {
                    fromEl.removeEventListener(name, ev as any);
                });
            }
            const toEvs: Map<string, Function> = toEl[EVENTS];
            if (toEvs) {
                toEvs.forEach((ev, name) => {
                    fromEl.addEventListener(name, ev as any);
                });
            }
            fromEl[EVENTS] = toEvs;
            return true;
        },
        onBeforeNodeDiscarded(node) {
            dispatchDestroyed(node);
            return true;
        }
    });
};
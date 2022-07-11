import { LIFECYCLE_EVENT } from "../enums";
import { nextTick } from "../utils";

const setElementDestroy = (el: HTMLElement) => {
    (el as any).onDestroy = true;
}

export const onElDestroy = (el: HTMLElement | Comment, cb: () => void) => {
    setElementDestroy(el as HTMLElement);
    nextTick(_ => {
        if (el['onDestroy']) {
            const parentElement = el.parentElement;
            if (parentElement && !parentElement['onDestroy']) {
                setElementDestroy(parentElement);
            }
        }
        el.addEventListener(LIFECYCLE_EVENT.Destroy, cb);
    })
};
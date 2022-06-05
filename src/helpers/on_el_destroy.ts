import { LIFECYCLE_EVENT } from "../enums";
import { nextTick } from "../utils";
export const onElDestroy = (el: HTMLElement | Comment, cb: () => void) => {
    (el as any).onDestroy = true;
    el.addEventListener(LIFECYCLE_EVENT.Destroy, _ => {
        nextTick(cb);
    });
};
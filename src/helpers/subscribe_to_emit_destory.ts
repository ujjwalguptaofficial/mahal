import { CHILD_DESTROY, EMIT_DESTROY } from "../constant";
import { addEventListener } from "../utils";

export const subscriveToDestroyFromChild = (el: HTMLElement) => {
    addEventListener(el, CHILD_DESTROY, (e) => {
        if (e.target === el) return;
        e.stopImmediatePropagation();
        el[EMIT_DESTROY] = true;
    });
};
import { CHILD_DESTROY, EMIT_DESTROY } from "../constant";

export const subscriveToDestroyFromChild = (el: HTMLElement) => {
    el.addEventListener(CHILD_DESTROY, (e) => {
        if (e.target === el) return;
        e.stopImmediatePropagation();
        el[EMIT_DESTROY] = true;
    });
}
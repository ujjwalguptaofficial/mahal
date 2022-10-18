import { emitUpdate } from "../helpers";
import { IDirectiveBinding } from "../interface";

export function htmlDirective(el: HTMLElement, binding: IDirectiveBinding) {
    if (binding.isComponent) return;

    const addInnerHTML = () => {
        el.innerHTML = binding.value[0] || '';
        emitUpdate(this);
    };
    addInnerHTML();
    return {
        valueUpdated() {
            addInnerHTML();
        }
    };
}

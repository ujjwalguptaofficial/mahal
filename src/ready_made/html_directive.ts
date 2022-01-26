import { emitUpdate } from "../helpers";
import { IDirectiveBinding } from "../interface";

// tslint:disable-next-line
export function htmlDirective(el: HTMLElement, binding: IDirectiveBinding) {
    if (binding.isComponent) return;

    const addClass = () => {
        el.innerHTML = binding.value[0] || '';
        emitUpdate(this);
    };
    addClass();
    return {
        valueUpdated() {
            addClass();
        }
    };
}

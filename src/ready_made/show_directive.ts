import { IDirectiveBinding } from "../interface";

export function showDirective(el: HTMLElement, binding: IDirectiveBinding) {
    function setElementShowHide() {
        el.style.display = binding.value ? 'unset' : 'none';
    }
    setElementShowHide();
    return {
        valueUpdated() {
            setElementShowHide();
        }
    }
}

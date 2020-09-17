import { IDirectiveBinding } from "../interface";

export function showDirective(el: HTMLElement, binding: IDirectiveBinding) {
    function setElementShowHide(value) {
        el.style.display = value ? 'unset' : 'none';
    }
    setElementShowHide(binding.value);
    return {
        valueUpdated(value) {
            setElementShowHide(value);
        }
    }
}

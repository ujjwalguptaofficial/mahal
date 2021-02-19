import { IDirectiveBinding } from "../interface";

export const showDirective = (el: HTMLElement, binding: IDirectiveBinding) => {
    const setElementShowHide = () => {
        el.style.display = binding.value ? 'unset' : 'none';
    };
    setElementShowHide();
    return {
        valueUpdated() {
            setElementShowHide();
        }
    };
};

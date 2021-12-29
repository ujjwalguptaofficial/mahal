import { IDirectiveBinding } from "../interface";

export const showDirective = (el: HTMLElement, binding: IDirectiveBinding) => {
    const setElementShowHide = () => {
        const value = binding.value[0];
        el.style.display = value ? 'unset' : 'none';
    };
    setElementShowHide();
    return {
        valueUpdated() {
            setElementShowHide();
        }
    };
};

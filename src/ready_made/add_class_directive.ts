import { IDirectiveBinding } from "../interface";
import { isObject } from "../utils";

export const classDirective = (el: HTMLElement, binding: IDirectiveBinding) => {

    const applyClass = (classes) => {
        if (isObject(classes)) {
            for (const name in classes) {
                if (classes[name]) {
                    applyClass(name);
                }
                else {
                    el.classList.remove(name);
                }
            }
        }
        else {
            el.classList.add(classes);
        }
    };

    const addClass = () => {
        binding.value.forEach(applyClass);
    };
    addClass();
    return {
        valueUpdated() {
            addClass();
        }
    };
};

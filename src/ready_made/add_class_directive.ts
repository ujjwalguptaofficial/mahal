import { IDirectiveBinding } from "../interface";
import { isObject } from "util";

export const classDirective = (el: HTMLElement, binding: IDirectiveBinding) => {
    const isValueObject = isObject(binding.value);

    const addClass = () => {
        if (binding.params.length > 1) {
            binding.value.forEach(value => {
                el.classList.add(value);
            });
        }
        else {
            if (isValueObject) {
                const classes = binding.value;
                for (const name in classes) {
                    if (classes[name]) {
                        el.classList.add(name);
                    }
                }
            }
            else {
                el.className += ` ${binding.value}`;
            }
        }
    };
    addClass();
    return {
        valueUpdated() {
            if (isValueObject) {
                const classes = binding.value;
                for (const name in classes) {
                    el.classList.remove(name);
                }
            }
            addClass();
        }
    };
};

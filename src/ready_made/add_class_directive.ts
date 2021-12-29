import { IDirectiveBinding } from "../interface";
import { isObject } from "../utils";

export const classDirective = (el: HTMLElement, binding: IDirectiveBinding) => {
    const isValueObject = isObject(binding.value[0]);

    const addClass = () => {
        if (binding.params.length > 1) {
            binding.value.forEach(value => {
                el.classList.add(value);
            });
        }
        else {
            const classValue = binding.value[0];
            if (isValueObject) {
                const classes = classValue;
                for (const name in classes) {
                    if (classes[name]) {
                        el.classList.add(name);
                    }
                }
            }
            else {
                el.className += ` ${classValue}`;
            }
        }
    };
    addClass();
    return {
        valueUpdated() {
            if (isValueObject) {
                const classes = binding.value[0];
                for (const name in classes) {
                    el.classList.remove(name);
                }
            }
            addClass();
        }
    };
};

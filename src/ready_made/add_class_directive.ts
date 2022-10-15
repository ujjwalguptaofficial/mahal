import { Component } from "../abstracts";
import { emitUpdate } from "../helpers";
import { IDirectiveBinding } from "../interface";
import { isObject } from "../utils";

export function classDirective(el: HTMLElement, binding: IDirectiveBinding) {

    let element: HTMLElement = el;
    const applyClass = (classes) => {
        if (isObject(classes)) {
            for (const name in classes) {
                if (classes[name]) {
                    applyClass(name);
                }
                else {
                    element.classList.remove(name);
                }
            }
        }
        else {
            element.classList.add(classes);
        }
    };

    const addClass = () => {
        binding.value.forEach(applyClass);
    };
    if (binding.isComponent) {
        (el as any as Component).waitFor('mount').then(_ => {
            element = (el as any as Component).element;
            addClass();
        });
    }
    else {
        addClass();
    }
    return {
        valueUpdated: () => {
            addClass();
            emitUpdate(this);
        }
    };
}

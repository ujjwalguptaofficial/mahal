import { IDirectiveBinding } from "../interface";
import { Component } from "../abstracts";
export function modelDirective(el: HTMLInputElement, binding: IDirectiveBinding, component) {
    const key = binding.props[0];
    el.value = binding.value;
    if (binding.isComponent === true) {
        (el as any).on("input", (value) => {
            component[key] = value;
        })
        // component.watch(key, (newValue, oldValue) => {
        //     el.value = newValue;
        //     (el as any).updateDOM_("value", oldValue);
        // });
    }
    else {
        el.oninput = (event) => {
            component[key] = (event.target as any).value;
        };
    }
    return {
        valueUpdated() {
            const newValue = binding.value;
            if (el.value !== newValue) {
                el.value = newValue;
                if (binding.isComponent === true) {
                    (el as any).watchList_["value"].forEach(cb => {
                        cb(newValue);
                    })
                }
            }
        }
    }
}

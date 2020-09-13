import { IDirectiveBinding } from "../interface";
import { Component } from "../abstracts";
export function modelDirective(el: HTMLInputElement, binding: IDirectiveBinding, component) {
    return {
        created(value) {
            el.value = value;
            if (binding.isComponent === true) {
                const key = binding.input;
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
                    component[binding.input] = (event.target as any).value;
                };
            }
        },
        valueUpdated(newValue) {
            if (el.value !== newValue) {
                el.value = newValue;
                if (binding.isComponent) {
                    (el as any).watchList_["value"].forEach(cb => {
                        cb(newValue);
                    })
                }
            }
        }
    }
}

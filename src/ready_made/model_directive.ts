import { IDirectiveBinding } from "../interface";
export function modelDirective(el: HTMLInputElement, binding: IDirectiveBinding, component) {
    return {
        created(value) {
            el.value = value;
            if (binding.isComponent === true) {
                (el as any).on("input", (value) => {
                    component[binding.input] = value;
                })
            }
            else {
                el.oninput = (event) => {
                    component[binding.input] = (event.target as any).value;
                };
            }
        },
        valueUpdated(value) {
            if (el.value !== value) {
                el.value = value;
            }
        }
    }
}

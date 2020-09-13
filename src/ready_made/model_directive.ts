import { IDirectiveBinding } from "../interface";
export function modelDirective(el: HTMLInputElement, binding: IDirectiveBinding, component) {
    return {
        created(value) {
            el.value = value;
            el.oninput = (event) => {
                component[binding.input] = (event.target as any).value;
            };
        },
        valueUpdated(value) {
            el.value = value;
        }
    }
}

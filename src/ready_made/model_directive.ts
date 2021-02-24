import { IDirectiveBinding } from "../interface";

const inputEvent = "input";
export function modelDirective(el: HTMLInputElement, binding: IDirectiveBinding) {
    const key = binding.props[0];
    el.value = binding.value;
    if (binding.isComponent === true) {
        (el as any).on(inputEvent, (value) => {
            this[key] = value;
        });
    }
    else {
        el.oninput = (event) => {
            this[key] = (event.target as any).value;
            this.emit(inputEvent, this[key]);
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
                    });
                }
            }
        }
    };
}

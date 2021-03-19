import { IDirectiveBinding, IAttrItem } from "../interface";
import { handleAttribute } from "../helpers";

const INPUT = "input";
const VALUE = "value";

export function modelDirective(el: HTMLInputElement, binding: IDirectiveBinding) {
    const key = binding.props[0];
    handleAttribute.call(this, el, {
        value: {
            k: key,
            v: binding[VALUE]
        } as IAttrItem
    }, binding.isComponent);
    if (binding.isComponent) {
        (el as any).on(INPUT, (val) => {
            this[key] = val;
        });
    }
    else {
        el.oninput = (event) => {
            this[key] = (event.target as any)[VALUE];
        };
    }
}

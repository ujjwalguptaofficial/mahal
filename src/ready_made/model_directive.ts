import { IDirectiveBinding, IAttrItem } from "../interface";
import { handleAttribute } from "../helpers";

export function createModelDirective(eventName, propToUse) {
    return function modelDirective(el: HTMLInputElement, binding: IDirectiveBinding) {
        const key = binding.props[0];
        handleAttribute.call(this, el, {
            value: {
                k: key,
                v: binding[propToUse][0]
            } as IAttrItem
        }, binding.isComponent);
        if (binding.isComponent) {
            (el as any).on(eventName, (val) => {
                binding.value = [val];
            });
        }
        else {
            el.oninput = (event) => {
                binding.value = [
                    (event.target as any)[propToUse]
                ];
            };
        }
    }
}


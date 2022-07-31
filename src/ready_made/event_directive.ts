import { IDirectiveBinding } from "../interface";
import { addEventListener } from "../utils";

export const eventDirective = (el: HTMLElement, binding: IDirectiveBinding) => {
    const params = binding.params;
    addEventListener(el, params[0], params[1] as any, params[2]);
};

import { IDirectiveBinding, IDirective } from "../interface";

// tslint:disable-next-line
export const refDirective = function (el: HTMLElement, binding: IDirectiveBinding): IDirective {
    const key = binding.props[0];
    this[key] = el;
    return {
        destroyed: () => {
            this[key] = null;
        }
    };
};

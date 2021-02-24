import { IDirectiveBinding, IAttrItem } from "../interface";

const INPUT = "input";
const VALUE = "value";

export function modelDirective(el: HTMLInputElement, binding: IDirectiveBinding) {
    const key = binding.props[0];
    this.handleAttribute_(el, {
        value: {
            k: key,
            v: binding[VALUE]
        } as IAttrItem
    }, binding.isComponent);
    if (binding.isComponent === true) {
        (el as any).on(INPUT, (val) => {
            this[key] = val;
        });
    }
    else {
        el[VALUE] = binding[VALUE];
        el.oninput = (event) => {
            this[key] = (event.target as any)[VALUE];
            // this.emit(INPUT, (event.target as any)[VALUE]);
        };
    }
    return {
        valueUpdated() {
            const newValue = binding[VALUE];
            // if (el[VALUE] !== newValue) {
            //     el[VALUE] = newValue;
            //     // if (binding.isComponent) {
            //     //     ((el as any).watchList_[VALUE] || []).forEach(cb => {
            //     //         cb(newValue);
            //     //     });
            //     // }
            // }
        }
    };
}

import { MAHAL_KEY } from "../constant";
import { forEach } from "./for_each";
import { isObject } from "./is_object";

export const setAttribute = (element: HTMLElement, key: string, value: string) => {
    switch (key) {
        case 'class':
            if (typeof value === 'string') {
                element.className = element.classList.length > 0 ? element.className + ' ' + value : value;
            }
            else {
                forEach(value, (isTrue, className) => {
                    element.classList[isTrue ? 'add' : 'remove'](className);
                });
            }
            break;
        case 'key':
            element[MAHAL_KEY] = value;
            break;
        case "value":
            // input element
            if (element.nodeType === 1) {
                (element as HTMLInputElement).value = value;
                break;
            }
        case 'style':
            if (isObject(value)) {
                let str = '';
                forEach(value, (styleValue, styleKey) => {
                    str += `${styleKey}:${styleValue};`
                });
                value = str;
            }
        default:
            element.setAttribute(key, value);
    }
};
import { MAHAL_KEY } from "../constant";
import { forEach } from "./for_each";
import { isObject } from "./is_object";

export const setPlainAttribute = (element: HTMLElement, key: string, value: any) => {
    switch (key) {
        case 'class':
            element.className = element.classList.length > 0 ? element.className + ' ' + value : value;
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

        default:
            element.setAttribute(key, value);
    }
}


export const setAttribute = (element: HTMLElement, key: string, value: any) => {
    switch (key) {
        case 'class':
            if (isObject(value)) {
                forEach(value, (isTrue, className) => {
                    element.classList[isTrue ? 'add' : 'remove'](className);
                });
                break;
            }
        case 'style':
            if (isObject(value)) {
                let str = '';
                forEach(value, (styleValue, styleKey) => {
                    str += `${styleKey}:${styleValue};`;
                });
                value = str;
            }
        default:
            if (value === false) {
                element.removeAttribute(key);
            }
            else {
                setPlainAttribute(element, key, value);
            }
    }
};
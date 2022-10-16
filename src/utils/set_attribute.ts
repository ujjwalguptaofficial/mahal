import { MAHAL_KEY } from "../constant";
import { forEach } from "./for_each";
import { isObject } from "./is_object";

export const evalStyle = (value) => {
    if (isObject(value)) {
        let str = '';
        forEach(value, (styleValue, styleKey) => {
            str += `${styleKey}:${styleValue};`
        });
        return str;
    }
    return value;
}

export const setAttribute = (element: HTMLElement, key: string, value: string) => {
    switch (key) {
        case 'key':
            element[MAHAL_KEY] = value;
            break;
        case "value":
            // input element
            if (element.nodeType === 1) {
                (element as HTMLInputElement).value = value;
                break;
            }
        case 'class':
            const applyClasses = (classes) => {
                if (isObject(classes)) {
                    forEach(classes, (isTrue, className) => {
                        if (isTrue) {
                            applyClasses(className);
                        }
                        else {
                            element.classList.remove(className);
                        }
                    });
                }
                else {
                    element.className = element.classList.length > 0 ? element.className + ' ' + classes : classes;
                }
            }
            applyClasses(value);
            break;
        default:
            switch (key) {
                case 'style':
                    value = evalStyle(value);
                    break;

            }
            element.setAttribute(key, value);
    }
};
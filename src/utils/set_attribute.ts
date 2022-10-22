import { MAHAL_KEY } from "../constant";
import { forEach } from "./for_each";
import { getAttribute } from "./get_attribute";
import { isObject } from "./is_object";

export const setPlainAttribute = (element: HTMLElement, key: string, value: any) => {
    switch (key) {
        case 'class':
            element.className = element.classList.length > 0 ? element.className + ' ' + value : value;
            break;
        case 'key':
            element[MAHAL_KEY] = value;
            break;
        default:
            element.setAttribute(key, value);
    }
};

const setOrRemoveAttribute = (element: HTMLElement, key: string, value: any) => {
    if (value === false) {
        element.removeAttribute(key);
    }
    else {
        setPlainAttribute(element, key, value);
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
            setOrRemoveAttribute(element, key, value);
            break;
        case "value":
            // input element
            switch (element.tagName) {
                case 'INPUT':
                case 'TEXTAREA':
                    switch (getAttribute(element, 'type')) {
                        case 'checkbox':
                            (element as HTMLInputElement).checked = value;
                            break;
                        default:
                            (element as HTMLInputElement).value = value;
                    }
                    break;
                default:
                    setOrRemoveAttribute(element, key, value);
            };
            break;
        case 'checked':
            if (element.tagName === 'INPUT') {
                switch (getAttribute(element, 'type')) {
                    case 'checkbox':
                    case 'radio':
                        (element as HTMLInputElement).checked = value;
                        return;
                }
            };
            setOrRemoveAttribute(element, key, value);
            break;
        case 'style':
            if (isObject(value)) {
                let str = '';
                forEach(value, (styleValue, styleKey) => {
                    str += `${styleKey}:${styleValue};`;
                });
                value = str;
            }
        default:
            setOrRemoveAttribute(element, key, value);
    }
};
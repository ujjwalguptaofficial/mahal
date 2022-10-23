import { MAHAL_KEY } from "../constant";
import { forEach } from "./for_each";
import { getAttribute } from "./get_attribute";
import { isObject } from "./is_object";

export function setPlainAttribute(element: HTMLElement, key: string, value: any) {
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
}

export function setAttribute(element: HTMLElement, key: string, value: any) {

    function setOrRemoveAttribute() {
        if (value === false) {
            element.removeAttribute(key);
        }
        else {
            setPlainAttribute(element, key, value);
        }
    }

    switch (key) {
        case 'class':
            if (isObject(value)) {
                forEach(value, (isTrue, className) => {
                    element.classList[isTrue ? 'add' : 'remove'](className);
                });
                break;
            }
            setOrRemoveAttribute();
            break;
        case "value":
            // input element
            switch (element.tagName) {
                case 'INPUT':
                case 'TEXTAREA':
                case 'SELECT':
                    (element as HTMLInputElement).value = value;
                    return;
            }
            setOrRemoveAttribute();
            break;
        case 'checked':
            if (element.tagName === 'INPUT') {
                switch (getAttribute(element, 'type')) {
                    case 'checkbox':
                    case 'radio':
                        (element as HTMLInputElement).checked = value;
                        return;
                }
            }
            setOrRemoveAttribute();
            break;
        case 'html':
            element.innerHTML = value;
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
            setOrRemoveAttribute();
    }
}
import { MAHAL_KEY } from "../constant";

export const setAttribute = (element: HTMLElement, key: string, value: string) => {
    switch (key) {
        case 'key':
            element[MAHAL_KEY] = value;
            break;
        case "value":
            if (element.nodeType === 1) {
                (element as HTMLInputElement).value = value;
                break;
            }
        default:
            element.setAttribute(key, value);
    }
};
import { KEY, MAHAL_KEY } from "../constant";

export const setAttribute = (element: HTMLElement, key: string, value: string) => {
    if (key === KEY) {
        element[MAHAL_KEY] = value;
        return;
    }
    // if (element.nodeType === 8) return;
    if (element.nodeType === 1 && key === "value") {
        return (element as HTMLInputElement).value = value;
    }
    return element.setAttribute(key, value);
};
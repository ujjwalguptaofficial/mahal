export function setAttribute(element: HTMLElement, key: string, value: string) {
    if (element.nodeType === 1 && key === "value") {
        return (element as HTMLInputElement).value = value;
    }
    return element.setAttribute(key, value);
}
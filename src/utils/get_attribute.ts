export const getAttribute = (element: HTMLElement, key: string) => {
    if (element.nodeType === 8) {
        return null;
    }
    return element.getAttribute(key);
};
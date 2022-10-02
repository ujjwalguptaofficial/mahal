export function addRc(this: Map<string, HTMLElement[]>, key, el) {
    const val = this.get(key);
    if (!val) {
        this.set(key, [el]);
    }
    else {
        val.push(el);
    }
    return el;
}
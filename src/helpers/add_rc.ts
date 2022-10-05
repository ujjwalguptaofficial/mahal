export function addRc(this: Map<string, Array<[HTMLElement, Function]>>, key, method: Function, el) {
    const val = this.get(key);
    const valueToInsert = [el, method];
    if (!val) {
        this.set(key, [
            valueToInsert as any
        ]);
    }
    else {
        val.push(valueToInsert as any);
    }
    return el;
}
export function addRc(this: Map<string, Array<[HTMLElement, Function]>>, key, method: Function) {
    const val = this.get(key);
    if (!val) {
        this.set(key, [
            method as any
        ]);
    }
    else {
        val.push(method as any);
    }
}
export function Reactive(target, key: string) {
    if (!target.$_reactives) {
        target.$_reactives = [];
    }
    target.$_reactives.push(key);
}
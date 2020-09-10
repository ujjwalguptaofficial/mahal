export function Reactive(target, key: string) {
    if (!target.reactives_) {
        target.reactives_ = [];
    }
    target.reactives_.push(key);
}
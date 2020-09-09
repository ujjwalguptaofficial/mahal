export function Reactive(target, key: string) {
    if (!target.reactives_) {
        target.reactives_ = [];
    }
    console.log("reactive key called", key);
    target.reactives_.push(key);
}
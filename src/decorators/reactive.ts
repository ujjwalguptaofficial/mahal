// tslint:disable-next-line
export const Reactive = (target, key: string) => {
    if (!target.reactives_) {
        target.reactives_ = [];
    }
    target.reactives_.push(key);
};
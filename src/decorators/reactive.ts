// tslint:disable-next-line
export const Reactive = (target, key: string) => {
    if (!target.__reactives__) {
        target.__reactives__ = {};
    }
    target.__reactives__[key] = true;
};
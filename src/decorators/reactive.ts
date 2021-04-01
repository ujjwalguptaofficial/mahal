// tslint:disable-next-line
export const Reactive = (target, key: string) => {
    if (!target._reactives) {
        target._reactives = [];
    }
    target._reactives.push(key);
};
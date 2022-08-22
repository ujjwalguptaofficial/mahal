import { replaceNullProp } from "../utils";

// tslint:disable-next-line
export const Reactive = (target, key: string) => {
    const obj = {};
    replaceNullProp(target, '_reactives_', () => obj);
    target._reactives_[key] = true;
};
import { replaceNullProp } from "../utils";

// tslint:disable-next-line
export const Reactive = (target, key: string) => {
    const obj = {};
    replaceNullProp(target, '__reactives__', () => obj);
    target.__reactives__[key] = true;
};
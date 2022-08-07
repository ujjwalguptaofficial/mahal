import { replaceNullProp } from "../utils";

// tslint:disable-next-line
export const Reactive = (target, key: string) => {
    replaceNullProp(target, '__reactives__', {});
    target.__reactives__[key] = true;
};
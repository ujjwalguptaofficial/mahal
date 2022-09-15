import { replaceNullProp } from "../utils";

export const reactive = (target, key: string) => {
    const obj = {};
    replaceNullProp(target, '_reactives_', () => obj);
    target._reactives_[key] = true;
};
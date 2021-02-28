import { isObject } from "./is_object";
export const clone = (obj) => {
    if (isObject(obj)) {
        const copy = {};
        for (const i in obj) {
            copy[i] = obj[i] != null && isObject(obj[i]) ? clone(obj[i]) : obj[i];
        }
        return copy;
    }
    return obj;
};
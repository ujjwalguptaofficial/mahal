import { isArray, isObject } from "mahal";


export const clone = (obj) => {
    if (isObject(obj)) {
        // if (isArray(obj)) {
        //     const copy = [];
        //     for (const i in obj) {
        //         copy[i] = obj[i] != null && isObject(obj[i]) ? clone(obj[i]) : obj[i];
        //     }
        //     return copy;
        // }
        const copy = isArray(obj) ? [] : {};
        for (const i in obj) {
            copy[i] = obj[i] != null && isObject(obj[i]) ? clone(obj[i]) : obj[i];
        }
        return copy;
    }
    return obj;
};
import { isObject } from "./is_object";
export function clone(obj) {
    if (isObject(obj)) {
        var copy = {};
        for (var i in obj) {
            copy[i] = obj[i] != null && isObject(obj[i]) ? clone(obj[i]) : obj[i]
        }
        return copy;
    }
    return obj;
}
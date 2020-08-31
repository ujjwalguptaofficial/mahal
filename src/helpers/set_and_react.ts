import { isNull, isPrimitive, LogHelper, isArray, isArrayIndex } from "../utils";

export function setAndReact(target, prop, valueToSet) {
    if (isNull(target)) {
        return LogHelper.warn("Can not set reactivity on null or undefined");
    }

    if (isPrimitive(target)) {
        return LogHelper.warn(`Can not set reactivity on primitive value ${target}`);
    }

    if (isArray(target) && isArrayIndex(prop)) {
        return target.splice(prop, 1, valueToSet);
    }

    if (target[prop]) {
        if (target.hasOwnProperty(prop)) {
            return target[prop] = valueToSet;
        }
    } else {
        target.push(valueToSet, prop);
    }



}
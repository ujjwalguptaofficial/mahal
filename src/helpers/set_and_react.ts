import { isNull, isPrimitive, LogHelper, isArray, isArrayIndex, indexOf } from "../utils";

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
            target.update(prop, valueToSet);
        }
    } else {
        target.push(valueToSet, prop);
    }
}

export function deleteAndReact(target, prop) {
    if (isNull(target)) {
        return LogHelper.warn("Can not set reactivity on null or undefined");
    }

    if (isPrimitive(target)) {
        return LogHelper.warn(`Can not set reactivity on primitive value ${target}`);
    }

    if (isArray(target) && isArrayIndex(prop)) {
        return target.splice(prop, 1);
    }

    if (target[prop]) {
        if (target.hasOwnProperty(prop)) {
            const index = indexOf(target, prop);
            delete target[prop];
            return target.splice(index, 1);
        }
    } else {
        return LogHelper.warn(`Can not delete - property ${prop} does not exist in target object ${target}`);
    }
}
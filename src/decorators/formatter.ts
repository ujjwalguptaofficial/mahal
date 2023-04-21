import { replaceNullProp } from "../utils";
import { wrapMethodDecorator } from "./wrap_method_decorator";

export function formatter(target, key: string): void;
export function formatter(name?: string): Function;
export function formatter(...args) {
    return wrapMethodDecorator(args, createFormatter);
}

function createFormatter(target: any, methodName: string, name: string) {
    const obj = {};
    replaceNullProp(target, '_formatters_', () => obj);
    target._formatters_[name || methodName] = target[methodName];
}
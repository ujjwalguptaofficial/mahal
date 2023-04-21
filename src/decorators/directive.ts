import { replaceNullProp } from "../utils";
import { wrapMethodDecorator } from "./wrap_method_decorator";

export function directive(target, key: string): void;
export function directive(name?: string): Function;
export function directive(...args) {
    return wrapMethodDecorator(args, createDirective);
};

function createDirective(target: any, methodName: string, name: string) {
    const obj = {};
    replaceNullProp(target, '_directive_', () => obj);
    target._directive_[name || methodName] = target[methodName];
}
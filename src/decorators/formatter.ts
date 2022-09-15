import { replaceNullProp } from "../utils";

// tslint:disable-next-line
export const formatter = (name?: string): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        const obj = {};
        replaceNullProp(target, '_formatters_', () => obj);
        target._formatters_[name || methodName] = target[methodName];
    });
};
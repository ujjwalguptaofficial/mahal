import { replaceNullProp } from "../utils";

// tslint:disable-next-line
export const Directive = (name?: string): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        const obj = {};

        replaceNullProp(target, '_directive_', () => obj);

        target._directive_[name || methodName] = target[methodName];
    });
};
import { replaceNullProp } from "../utils";

// tslint:disable-next-line
export const Directive = (name?: string): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        const obj = {};

        replaceNullProp(target, '__directive__', () => obj);

        target.__directive__[name || methodName] = target[methodName];
    });
};
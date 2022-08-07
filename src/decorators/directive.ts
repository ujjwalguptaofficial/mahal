import { replaceNullProp } from "../utils";

// tslint:disable-next-line
export const Directive = (name?: string): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {

        replaceNullProp(target, '__directive__', {});

        target.__directive__[name || methodName] = target[methodName];
    });
};
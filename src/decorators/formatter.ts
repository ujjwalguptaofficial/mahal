import { replaceNullProp } from "../utils";

// tslint:disable-next-line
export const Formatter = (name?: string): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        const obj = {};
        replaceNullProp(target, '__formatters__', () => obj);
        target.__formatters__[name || methodName] = target[methodName];
    });
};
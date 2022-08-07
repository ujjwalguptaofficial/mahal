import { replaceNullProp } from "../utils";

// tslint:disable-next-line
export const Computed = (...args): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {

        replaceNullProp(target, '__computed__', {});

        target.__computed__[methodName] = { args, fn: descriptor.value || descriptor.get };
    });
};
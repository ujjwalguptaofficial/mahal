import { replaceNullProp } from "../utils";

export const computed = (...args): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        const obj = {};
        replaceNullProp(target, '_computed_', () => obj);

        target._computed_[methodName] = { args, fn: descriptor.value || descriptor.get };
    });
};
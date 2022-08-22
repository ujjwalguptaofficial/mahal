import { replaceNullProp } from "../utils";

// tslint:disable-next-line
export const Computed = (...args): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        const obj = {};
        replaceNullProp(target, '_computed_', () => obj);

        target._computed_[methodName] = { args, fn: descriptor.value || descriptor.get };
    });
};
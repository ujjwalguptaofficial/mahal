import { replaceNullProp } from "../utils";

// tslint:disable-next-line
export const OnChange = (propName: string): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        replaceNullProp(target, '__watchers__', {});
        target.__watchers__[propName] = descriptor.value;
    });
};
import { Reactive } from "./reactive";

// tslint:disable-next-line
export const Watch = (propName: string): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        if (!target.watchList_) {
            target.watchList_ = {};
        }
        target.watch(propName, descriptor.value);
    });
};
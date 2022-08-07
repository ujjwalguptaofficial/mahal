import { COMPONENT_COMPUTED } from "../constant";

// tslint:disable-next-line
export const Computed = (...args): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        if (!target[COMPONENT_COMPUTED]) {
            target[COMPONENT_COMPUTED] = {};
        }
        target[COMPONENT_COMPUTED][methodName] = { args, fn: descriptor.value || descriptor.get };
    });
};
import { COMPONENT_COMPUTED } from "../constant";
import { replaceNullProp } from "../utils";

// tslint:disable-next-line
export const Computed = (...args): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {

        replaceNullProp(target, COMPONENT_COMPUTED, {});

        target[COMPONENT_COMPUTED][methodName] = { args, fn: descriptor.value || descriptor.get };
    });
};
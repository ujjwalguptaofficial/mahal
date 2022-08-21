import { Component } from "../abstracts";
import { EventBus, nextTick, replaceNullProp } from "../utils";

// tslint:disable-next-line
export const Watch = (propName: string): MethodDecorator => {
    return ((target: Component, methodName: string, descriptor: PropertyDescriptor) => {
        replaceNullProp(target, '__watchBus__', new EventBus());
        target.watch(propName, descriptor.value);
    });
};
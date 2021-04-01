// tslint:disable-next-line
export const Computed = (...args): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        if (!target._computed) {
            target._computed = {};
        }
        target._computed[methodName] = { args, fn: descriptor.get };
    });
};
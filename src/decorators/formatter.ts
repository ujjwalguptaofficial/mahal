// tslint:disable-next-line
export const Formatter = (name?: string): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        if (!target._formatters) {
            target._formatters = {};
        }
        target._formatters[name || methodName] = target[methodName];
    });
};
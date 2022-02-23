// tslint:disable-next-line
export const Formatter = (name?: string): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        if (!target.__formatters__) {
            target.__formatters__ = {};
        }
        target.__formatters__[name || methodName] = target[methodName];
    });
};
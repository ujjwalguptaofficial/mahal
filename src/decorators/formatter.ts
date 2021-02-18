// tslint:disable-next-line
export const Formatter = (name?: string): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        if (!target.formatters_) {
            target.formatters_ = {};
        }
        target.formatters_[name || methodName] = target[methodName];
    });
};
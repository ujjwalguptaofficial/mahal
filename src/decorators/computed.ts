// tslint:disable-next-line
export const Computed = (...args): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        if (!target.computed_) {
            target.computed_ = {};
        }
        target.computed_[methodName] = { args, fn: descriptor.get };
    });
};
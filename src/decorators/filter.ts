// tslint:disable-next-line
export const Filter = (name?: string): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        if (!target.filters_) {
            target.filters_ = {};
        }
        target.filters_[name || methodName] = target[methodName];
    });
};
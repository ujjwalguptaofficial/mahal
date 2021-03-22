// tslint:disable-next-line
export const OnChange = (propName: string): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        if (!target.watchList_) {
            target.watchList_ = {};
        }
        target.watchList_[propName] = descriptor.value;
    });
};
// tslint:disable-next-line
export const Directive = (name?: string): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        if (!target.directive_) {
            target.directive_ = {};
        }
        target.directive_[name || methodName] = target[methodName];
    });
};
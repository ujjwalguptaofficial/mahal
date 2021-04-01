// tslint:disable-next-line
export const Directive = (name?: string): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        if (!target._directive) {
            target._directive = {};
        }
        target._directive[name || methodName] = target[methodName];
    });
};
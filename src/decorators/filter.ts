
// tslint:disable-next-line
export const Filter = (name?: string): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        const className = (target.constructor.name as string);
        if (!target.$_filters) {
            target.$_filters = {};
        }
        target.$_filters[name || methodName] = target[methodName];
    });
};
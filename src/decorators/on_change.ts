// tslint:disable-next-line
export const OnChange = (propName: string): MethodDecorator => {
    return ((target: any, methodName: string, descriptor: PropertyDescriptor) => {
        if (!target._watchList) {
            target._watchList = {};
        }
        target._watchList[propName] = descriptor.value;
    });
};
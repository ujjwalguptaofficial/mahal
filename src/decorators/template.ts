// tslint:disable-next-line
export const Template = (stringTemplate: string) => {
    return function Template<T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            template = stringTemplate
        }
    }
};

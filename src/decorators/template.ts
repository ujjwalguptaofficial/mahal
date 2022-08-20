// tslint:disable-next-line
export const Template = (stringTemplate: string) => {
    // tslint:disable-next-line
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        return class extends constructor {
            template = stringTemplate;
        };
    };
};

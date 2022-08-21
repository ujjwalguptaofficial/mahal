export const replaceNullProp = (target: object, prop: string, getValue: () => any) => {
    target[prop] = target[prop] || getValue();
};
export const replaceNullProp = (target: object, prop: string, value) => {
    target[prop] = target[prop] || value;
};
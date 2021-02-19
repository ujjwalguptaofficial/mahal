export const getFromWindow = <T>(prop: string) => {
    return window[prop] as T;
};
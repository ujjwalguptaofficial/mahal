import { TRUE } from "../constant";

export const hashifyArray = (input: any[]) => {
    const obj = {};
    input.forEach(item => {
        obj[item] = TRUE;
    });
    return obj;
};
import { removeCommaFromLast } from "./remove_comma_from_last";

export function convertArrayToString(value: string[]) {
    let result = "[";
    value.forEach(val => {
        result += `'${val}',`
    })
    result = removeCommaFromLast(result);
    result += "]"
    return result;
}
import { removeCommaFromLast } from "./remove_comma_from_last";
import { stringRegex } from "./constant";

export function convertArrayToString(value: string[], shouldAddSingleQuote = true) {
    let result = "[";
    value.forEach(val => {
        result += (shouldAddSingleQuote === true ? (
            stringRegex.test(val) === true ? val : `'${val}'`) :
            val) + ","
    })
    result = removeCommaFromLast(result);
    result += "]"
    return result;
}
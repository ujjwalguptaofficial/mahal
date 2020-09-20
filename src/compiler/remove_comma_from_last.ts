export function removeCommaFromLast(value: string) {
    value = value.trim();
    if (value[value.length - 1] === ",") {
        value = value.substr(0, value.length - 1);
    }
    return value;
}
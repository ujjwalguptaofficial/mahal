export function indexOf(value, key) {
    let index = -1;
    for (let item in value) {
        ++index;
        if (item === key) {
            return index;
        }
    }
    return -1;
}
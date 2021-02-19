export const indexOf = (value, key) => {
    let index = -1;
    for (const item in value) {
        ++index;
        if (item === key) {
            return index;
        }
    }
    return -1;
};
export function getUniqueFromArray(value: any[]) {
    const obj = {};
    value.forEach(item => {
        obj[item] = true;
    })
    return Object.values(obj);
}
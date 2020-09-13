export function merge(obj1, obj2) {
    for (const key in obj2) {
        if (obj1[key] == null) {
            obj1[key] = obj2[key];
        }
    }
    return obj1;
}
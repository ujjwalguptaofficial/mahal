export function forOwnAndNotFn(obj: Object, cb: (key, value) => void) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] !== "function") {
            cb(key, obj[key])
        }
    }
};
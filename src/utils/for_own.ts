export function forOwn(obj: Object, cb: (key, value) => void) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cb(key, obj[key])
        }
    }
};
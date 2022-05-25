export const forEach = (obj, cb: (value, key) => void) => {
    if (obj.forEach) {
        obj.forEach((item, index) => {
            cb(item, index);
        });
        return;
    }
    for (const key in obj) {
        cb(obj[key], key);
    }
};

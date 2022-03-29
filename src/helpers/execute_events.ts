export function executeEvents(promises, param) {
    promises.reduce((p, promise) => {
        return p.then(result => promise.call(this, result));
    }, Promise.resolve(param));
}
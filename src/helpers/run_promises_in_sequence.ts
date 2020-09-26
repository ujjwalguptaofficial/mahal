export function runPromisesInSequence(promises, param) {
    promises.reduce((p, promise) => {
        return p.then((result) => promise(result));
    }, Promise.resolve(param));
}
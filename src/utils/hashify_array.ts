export const hashifyArray = (input: any[]) => {
    const obj = {};
    input.forEach(item => {
        obj[item] = true;
    });
    return obj;
}
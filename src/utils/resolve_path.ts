export const resolveValue = (path: string, value) => {
    if (!path) return value;
    const properties = path.split(".");
    return properties.reduce((prev, curr) => prev && prev[curr], value);
};
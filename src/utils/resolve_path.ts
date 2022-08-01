import { isArray } from "../utils";

export const resolveValue = (path: string, value) => {
    if (!path) return;
    const properties = isArray(path) ? path as any as string[] : path.split(".");
    return properties.reduce((prev, curr) => prev && prev[curr], value);
};
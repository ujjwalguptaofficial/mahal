import { isArray } from "../utils";

export const resolveValue = (path: string, value) => {
    const properties = isArray(path) ? path as any as string[] : path.split(".");
    return properties.reduce((prev, curr) => prev && prev[curr], value);
};
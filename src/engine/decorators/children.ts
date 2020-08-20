import { Component } from "../abstracts";

// tslint:disable-next-line
export const Children = (value: { [key: string]: typeof Component }) => {
    return function Template<T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            children = value
        }
    }
};

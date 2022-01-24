import { Component } from "../abstracts";

// tslint:disable-next-line
export const Children = (value: { [key: string]: typeof Component | Promise<any> }) => {
    // tslint:disable-next-line
    return function Template<T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            children = value;
        };
    };
};

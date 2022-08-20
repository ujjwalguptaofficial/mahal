import { Component } from "../abstracts";
import { ILazyComponent } from "../interface";

// tslint:disable-next-line
export const Children = (value: { [key: string]: typeof Component | Promise<any> | Function | ILazyComponent }) => {
    // tslint:disable-next-line
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        return class extends constructor {
            children = value;
        };
    };
};

import { Component } from "../abstracts";
import { Observer } from "./observer";

const ob = '_ob';
export const attachGetterSetter = (comp: Component) => {
    const keys = Object.keys(comp['_props']).concat(comp['_reactives'] || []);
    if (keys.length) {
        comp[ob] = new Observer(comp.setState.bind(comp));
        comp[ob].create(comp, keys);
    }
};
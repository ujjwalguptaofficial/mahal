import { Component } from "../abstracts";
import { Observer } from "./observer";
import { onChange } from "./comp_on_change";

const ob = '_ob';
export function attachGetterSetter(comp: Component) {
    comp[ob] = new Observer(onChange.bind(comp));
    comp[ob].create(comp, Object.keys(comp['_props']).concat(comp['_reactives'] || []));
}
import { Component } from "../abstracts";
import { Observer } from "./observer";

export function attachGetterSetter(comp: Component) {
    comp['observer_'] = new Observer();
    comp['observer_'].onChange = comp['onChange_'].bind(comp);
    comp['observer_'].create(comp, Object.keys(comp['props_']).concat(comp['reactives_'] || []));
}
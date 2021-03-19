import { Component } from "../abstracts";
import { Observer } from "./observer";

export function attachGetterSetter(this: Component) {
    (this as any).observer_ = new Observer();
    (this as any).observer_.onChange = (this as any).onChange_.bind(this);
    (this as any).observer_.create(this, Object.keys((this as any).props_).concat((this as any).reactives_ || []));
}
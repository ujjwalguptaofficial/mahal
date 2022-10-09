import { Component } from "../abstracts";
import { IDirectiveBinding, IReactiveAttrItem } from "../interface";

// tslint:disable-next-line
export function createModelDirective(eventName, propToUse) {
    return function modelDirective(this: Component, el: HTMLInputElement, binding: IDirectiveBinding) {
        const key = binding.props[0];
        const isComponent = binding.isComponent;
        this['_handleAttr_'](el, isComponent, {
            rAttr: {
                value: {
                    k: key,
                    v: binding[propToUse][0]
                } as IReactiveAttrItem
            }
        });
        const setComponentValue = (value) => {
            binding.value = [value];
        };
        if (isComponent) {
            (el as any).on(eventName, (val) => {
                setComponentValue(val);
            });
        }
        else {
            el.oninput = (event) => {
                setComponentValue(
                    (event.target as any)[propToUse]
                );
            };
        }
    };
}


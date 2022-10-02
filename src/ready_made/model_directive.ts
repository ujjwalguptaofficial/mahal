import { Component } from "../abstracts";
import { IDirectiveBinding, IAttrItem } from "../interface";

// tslint:disable-next-line
export function createModelDirective(eventName, propToUse) {
    return function modelDirective(this: Component, el: HTMLInputElement, binding: IDirectiveBinding) {
        const key = binding.props[0];
        const isComponent = binding.isComponent;
        this['_handleAttr_'](el, {
            value: {
                k: key,
                v: binding[propToUse][0]
            } as IAttrItem
        }, isComponent);
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


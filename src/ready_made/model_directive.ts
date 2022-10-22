import { Component } from "../abstracts";
import { IDirectiveBinding, IReactiveAttrItem } from "../interface";
import { getAttribute } from "../utils";

// tslint:disable-next-line
export function createModelDirective(eventName, propToUse) {

    return function modelDirective(this: Component, el: HTMLInputElement, binding: IDirectiveBinding) {
        const key = binding.props[0];
        const isComponent = binding.isComponent;
        let attributeType;
        const propForHTMLElement = isComponent ? propToUse : (() => {
            attributeType = getAttribute(el, 'type');
            switch (attributeType) {
                case 'checkbox':
                case 'radio':
                    return 'checked';
                default:
                    return 'value';
            }
        })();
        const attribute = {
            k: [key],
            get v() {
                if (attributeType === 'radio') {
                    return binding[propToUse][0] === el.value;
                }
                return binding[propToUse][0];
            }
        } as IReactiveAttrItem;
        this['_handleAttr_'](el, isComponent, {
            rAttr: {
                [propForHTMLElement]: attribute
            }
        });
        const setComponentValue = (value) => {
            binding[propToUse] = [value];
        };
        if (isComponent) {
            (el as any).on(eventName, (val) => {
                setComponentValue(val);
            });
        }
        else {
            el.oninput = (event) => {
                setComponentValue(
                    (event.target as any)[
                    getAttribute(el, 'type') === 'checkbox' ? 'checked' : 'value'
                    ]
                );
            };
        }
    };
}


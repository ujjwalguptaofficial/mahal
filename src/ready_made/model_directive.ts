import { Component } from "../abstracts";
import { IDirectiveBinding, IReactiveAttrItem } from "../interface";
import { getAttribute } from "../utils";

// tslint:disable-next-line
export function createModelDirective(eventName, propToUse) {
    return function modelDirective(this: Component, el: HTMLInputElement, binding: IDirectiveBinding) {
        const key = binding.props[0];
        const isComponent = binding.isComponent;
        this['_handleAttr_'](el, isComponent, {
            rAttr: {
                [propToUse]: {
                    k: [key],
                    get v() {
                        return binding[propToUse][0];
                    }
                } as IReactiveAttrItem
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
            const propForHTMLElement = (() => {
                switch (getAttribute(el, 'type')) {
                    case 'checkbox':
                        return 'checked';
                    default:
                        return 'value';
                }
            })();
            el.oninput = (event) => {
                setComponentValue(
                    (event.target as any)[propForHTMLElement]
                );
            };
        }
    };
}


import { Component } from "../abstracts";
import { IAttrItem } from "../interface";
import { getDataype, forOwn, setAttribute, nextTick } from "../utils";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { emitUpdate } from "./emit_update";
import { getAttributeValue } from "./get_attribute_value";
import { Logger } from "./logger";
import { onElDestroy } from "./destroy_helper";
import { COMPONENT_PROPS } from "../constant";


export function handleAttribute(this: Component, component, attr, isComponent) {
    if (!attr) return;
    const methods = new Map<string, Function>();
    const subscribeToDestroy = (el: HTMLElement) => {
        onElDestroy(el, () => {
            methods.forEach((eventCb, evName) => {
                this.unwatch(evName, eventCb);
            });
        });
    };
    if (isComponent) {
        const htmlAttributes = [];
        if (!attr) return htmlAttributes;
        for (const key in attr) {
            const value: IAttrItem = attr[key];
            const propDescription = component[COMPONENT_PROPS][key];
            if (propDescription) {
                const attrValue = getAttributeValue(value, value.v);
                if (propDescription.type) {
                    const expected = propDescription.type;
                    const received = getDataype(attrValue);
                    if (expected !== received) {
                        this.waitFor(LIFECYCLE_EVENT.Mount).then(_ => {
                            new Logger(ERROR_TYPE.PropDataTypeMismatch,
                                {
                                    prop: key,
                                    exp: expected,
                                    got: received,
                                    html: this.outerHTML,
                                    file: (this as any).file_
                                }).logPlainError();
                        });
                    }
                }

                component[key] = attrValue;
                const attributeKey = value.k;
                if (attributeKey) {
                    const method = (newValue) => {
                        Component.shouldCheckProp = false;
                        component.setState(key, getAttributeValue(value, newValue));
                        Component.shouldCheckProp = true;
                    };
                    this.watch(attributeKey, method);
                    methods.set(attributeKey, method);
                }
            }
            else {
                htmlAttributes.push({
                    key,
                    value: getAttributeValue(value, value.v)
                });
            }
        }
        if (methods.size > 0) {
            nextTick(_ => {
                subscribeToDestroy(component.element);
            });
        }
        return htmlAttributes;
    }

    forOwn(attr, (key, attrItem) => {
        const attrValue = getAttributeValue(attrItem, attrItem.v);
        setAttribute(component, key, attrValue);
        const attributeKey = attrItem.k;
        if (attributeKey) {
            const method = (newValue) => {
                setAttribute(component, key, getAttributeValue(attrItem, newValue));
                emitUpdate(this);
            };
            this.watch(attributeKey, method);
            methods.set(attributeKey, method);
        }
    });

    if (methods.size > 0) {
        subscribeToDestroy(component);
    }

}
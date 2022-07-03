import { Component } from "../abstracts";
import { IAttrItem } from "../interface";
import { getDataype, clone, forOwn, setAttribute, nextTick } from "../utils";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { emitUpdate } from "./emit_update";
import { getAttributeValue } from "./get_expression_value";
import { Logger } from "./logger";
import { onElDestroy } from "./on_el_destroy";


export function handleAttribute(this: Component, component, attr, isComponent) {
    const eventIds = new Map<string, number>();
    nextTick(_ => {
        if (eventIds.size === 0) return;
        onElDestroy(isComponent ? component.element : component, () => {
            eventIds.forEach((eventId, evName) => {
                this.unwatch(evName, eventId);
            });
        });
    });
    if (isComponent) {
        const htmlAttributes = [];
        if (!attr) return htmlAttributes;
        for (const key in attr) {
            const value: IAttrItem = attr[key];
            const propDescription = component.__props__[key];
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

                component[key] = clone(attrValue);
                const attributeKey = value.k;
                if (attributeKey) {
                    eventIds[attributeKey] = this.watch(attributeKey, (newValue) => {
                        Component.shouldCheckProp = false;
                        component.setState(key, getAttributeValue(value, newValue));
                        Component.shouldCheckProp = true;
                    });
                }
            }
            else {
                htmlAttributes.push({
                    key,
                    value: getAttributeValue(value, value.v)
                });
            }
        }
        return htmlAttributes;
    }

    forOwn(attr, (key, attrItem) => {
        const attrValue = getAttributeValue(attrItem, attrItem.v);
        setAttribute(component, key, attrValue);
        const attributeKey = attrItem.k;
        if (attributeKey) {
            eventIds.set(attributeKey, this.watch(attributeKey, (newValue) => {
                setAttribute(component, key, getAttributeValue(attrItem, newValue));
                emitUpdate(this);
            }));
        }
    });
}
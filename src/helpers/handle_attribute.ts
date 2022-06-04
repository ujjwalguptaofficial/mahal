import { Component } from "../abstracts";
import { IAttrItem } from "../interface";
import { getDataype, clone, forOwn, setAttribute, nextTick, getObjectLength } from "../utils";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { emitUpdate } from "./emit_update";
import { getAttributeValue } from "./get_expression_value";
import { Logger } from "./logger";
import { KEY, MAHAL_KEY } from "../constant";
import { onElDestroy } from "./on_el_destroy";


export function handleAttribute(this: Component, component, attr, isComponent) {
    const eventIds = {};
    // this.unwatch()
    nextTick(_ => {
        if (getObjectLength(eventIds) === 0) return;
        onElDestroy(isComponent ? component.element : component, () => {
            for (const evName in eventIds) {
                this.unwatch(evName, eventIds[evName]);
            }
        });
    });
    if (isComponent) {
        const htmlAttributes = [];
        if (!attr) return htmlAttributes;
        for (const key in attr) {
            const value: IAttrItem = attr[key];
            if (component.__props__[key]) {
                const attrValue = getAttributeValue(value, value.v);
                if (component.__props__[key].type) {
                    const expected = component.__props__[key].type;
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
                    eventIds[attributeKey] = this.watch(attributeKey, (newValue, oldValue) => {
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
        if (key === KEY) {
            component[MAHAL_KEY] = attrValue;
        }
        else {
            setAttribute(component, key, attrValue);
        }
        const attributeKey = attrItem.k;
        if (attributeKey) {
            eventIds[attributeKey] = this.watch(attributeKey, (newValue) => {
                setAttribute(component, key, getAttributeValue(attrItem, newValue));
                emitUpdate(this);
            });
        }
    });
}
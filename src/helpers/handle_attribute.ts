import { Component } from "../abstracts";
import { IAttrItem } from "../interface";
import { getDataype, forOwn, setAttribute, nextTick } from "../utils";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { emitUpdate } from "./emit_update";
import { getAttributeValue } from "./get_attribute_value";
import { Logger } from "./logger";
import { onElDestroy } from "./destroy_helper";


Component.prototype['_handleAttr_'] = function (this: Component, component, attr, isComponent, addRc?) {
    if (!attr) return;

    const handleDynamicAttribute = isComponent ? (key: string, attrItem: IAttrItem) => {
        return (newValue) => {
            Component.shouldCheckProp = false;
            component.setState(key, getAttributeValue(attrItem, newValue));
            Component.shouldCheckProp = true;
        }
    } : (key: string, attrItem: IAttrItem) => {
        return (newValue) => {
            setAttribute(component, key, getAttributeValue(attrItem, newValue));
            emitUpdate(this);
        }
    }


    // store watchcallback
    const methods = new Map<string, Function>();

    // unwatch the callback
    const subscribeToDestroy = (el: HTMLElement) => {
        onElDestroy(el, () => {
            methods.forEach((eventCb, evName) => {
                this.unwatch(evName, eventCb);
            });
        });
    };
    const handleAttributeRc = (key: string, attrItem: IAttrItem) => {
        const rc = attrItem.rc
        if (rc && key !== 'key') {
            addRc()(rc, (newValue, el) => {
                handleDynamicAttribute(key, attrItem)(newValue);
            }, isComponent ? component.element : component);
        }
    }
    if (isComponent) {
        const htmlAttributes = [];
        if (!attr) return htmlAttributes;
        for (const key in attr) {
            const value: IAttrItem = attr[key];
            const propDescription = component._props_[key];
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
                    const method = handleDynamicAttribute(key, value);
                    this.watch(attributeKey, method);
                    methods.set(attributeKey, method);
                }
                nextTick(() => {
                    handleAttributeRc(key, value);
                })
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

    forOwn(attr, (key, attrItem: IAttrItem) => {
        const attrValue = getAttributeValue(attrItem, attrItem.v);
        setAttribute(component, key, attrValue);
        const attributeKey = attrItem.k;
        if (attributeKey) {
            const method = handleDynamicAttribute(key, attrItem);
            this.watch(attributeKey, method);
            methods.set(attributeKey, method);
        }
        handleAttributeRc(key, attrItem);
    });

    if (methods.size > 0) {
        subscribeToDestroy(component);
    }

};
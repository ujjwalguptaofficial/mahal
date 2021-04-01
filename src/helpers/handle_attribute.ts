import { Component } from "../abstracts";
import { IAttrItem } from "../interface";
import { getDataype, Logger, clone, forOwn, setAttribute } from "../utils";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { Observer } from "./observer";
import { emitUpdate } from "./emit_update";

export function handleAttribute(this: Component, component, attr, isComponent) {
    if (isComponent) {
        const htmlAttributes = [];
        if (!attr) return htmlAttributes;
        for (const key in attr) {
            const value: IAttrItem = attr[key];
            if (component.props_[key]) {
                if (component.props_[key].type) {
                    const expected = component.props_[key].type;
                    const received = getDataype(value.v);
                    if (expected !== received) {
                        this.waitFor(LIFECYCLE_EVENT.Rendered).then(_ => {
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

                component[key] = clone(value.v);
                if (value.k) {
                    this.watch(value.k, (newValue) => {
                        Observer.shouldCheckProp = false;
                        component[key] = newValue;
                        Observer.shouldCheckProp = true;
                    });
                }

            }
            else {
                htmlAttributes.push({
                    key,
                    value: value.v
                });
            }
        }
        return htmlAttributes;
    }

    forOwn(attr, (key, attrItem) => {
        setAttribute(component, key, attrItem.v);
        if (attrItem.k) {
            this.watch(attrItem.k, (newValue) => {
                setAttribute(component, key, newValue);
                emitUpdate(this);
            });
        }
    });
}
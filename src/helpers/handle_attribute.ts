import { Component } from "../abstracts";
import { IAttrItem, IElementOption, IReactiveAttrItem } from "../interface";
import { getDataype, forOwn, setAttribute, nextTick } from "../utils";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { emitUpdate } from "./emit_update";
import { getAttributeValue } from "./get_attribute_value";
import { Logger } from "./logger";
import { onElDestroy } from "./destroy_helper";

Component.prototype['_handleAttr_'] = function (this: Component, component, isComponent, option: IElementOption) {
    const attr = option.attr;
    const htmlAttributes = [];
    const handleAttributeForComponent = (key: string, attrItem: IAttrItem) => {
        const propDescription = component._props_[key];
        if (propDescription) {
            const attrValue = attrItem.v as string;
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
            return true;
        }
        else {
            htmlAttributes.push({
                key,
                value: attrItem.v as any
            });
        }
    };
    if (attr) {
        if (isComponent) {
            forOwn(attr, (key, attrItem: IAttrItem) => {
                handleAttributeForComponent(key, attrItem);
            });
        }
        else {
            forOwn(attr, (key, attrItem: IAttrItem) => {
                setAttribute(component, key, attrItem.v as any);
            });
        }
    }

    const reactiveAttr = option.rAttr;
    if (!reactiveAttr) return htmlAttributes;

    const handleReactiveAttribute = isComponent ? (key: string, attrItem: IReactiveAttrItem) => {
        return (newValue, comp: Component) => {
            Component.shouldCheckProp = false;
            comp.setState(key, getAttributeValue(attrItem, newValue));
            Component.shouldCheckProp = true;
        };
    } : (key: string, attrItem: IReactiveAttrItem) => {
        return (newValue, el: HTMLElement) => {
            setAttribute(el, key, getAttributeValue(attrItem, newValue));
            emitUpdate(this);
        };
    };


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
    const handleAttributeRc = (key: string, attrItem: IReactiveAttrItem) => {
        const rc = attrItem.rc;
        if (rc) {
            if (process.env.NODE_ENV !== 'production' && key === 'key') {
                throw 'found key within rc';
            }
            option.rcm()(rc, (newValue, el) => {
                handleReactiveAttribute(key, attrItem)(newValue, el);
            }, component);
        }
    };
    const watchAttribute = (key: string, attrItem: IReactiveAttrItem) => {
        const attributeKey = attrItem.k;
        if (!attributeKey) return;
        const m = handleReactiveAttribute(key, attrItem);
        const method = (newValue) => {
            m(newValue, component);
        };
        this.watch(attributeKey, method);
        methods.set(attributeKey, method);

    };
    if (isComponent) {
        forOwn(reactiveAttr, (key, attrItem: IReactiveAttrItem) => {
            if (handleAttributeForComponent(key, attrItem)) {
                watchAttribute(key, attrItem);
            }
            handleAttributeRc(key, attrItem);
        });
        if (methods.size > 0) {
            nextTick(_ => {
                subscribeToDestroy(component.element);
            });
        }
        return htmlAttributes;
    }

    forOwn(reactiveAttr, (key, attrItem: IReactiveAttrItem) => {
        const attrValue = getAttributeValue(attrItem, attrItem.v);
        setAttribute(component, key, attrValue);
        watchAttribute(key, attrItem);
        handleAttributeRc(key, attrItem);
    });

    if (methods.size > 0) {
        subscribeToDestroy(component);
    }
};
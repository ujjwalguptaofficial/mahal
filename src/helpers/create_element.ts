import { createCommentNode } from "./create_coment_node";
import { HTML_TAG, ERROR_TYPE } from "../enums";
import { DEFAULT_SLOT_NAME } from "../constant";
import { executeRender, replaceEl, getAttribute, setAttribute, createComponent, ILazyComponentPayload, addEventListener, insertBefore, forEach } from "../utils";
import { Component } from "../abstracts";
import { handleInPlace } from "./handle_in_place";
import { emitError } from "./emit_error";
import { Logger } from "./logger";
import { forEachEvent } from "./for_each_event";
import "./handle_attribute";
import "./handle_directive";
import "./handle_expression";
import { IElementOption } from "../interface";

const loadComponent = (componentClass) => {
    if (componentClass instanceof Promise) {
        return componentClass.then(comp => {
            return comp.default;
        });
    }
    else if (componentClass.isLazy) {
        return loadComponent(
            (componentClass as ILazyComponentPayload).component()
        );
    }
    return componentClass;
};


export const createElement = function (this: Component, tag: string, childs: HTMLElement[], option): HTMLElement | Comment {
    if (tag == null) {
        return createCommentNode();
    }

    const ctx = this;

    if (HTML_TAG.has(tag)) {
        return ctx['_createNativeComponent_'](tag, childs, option);
    }

    if (!option) {
        option = {};
    }

    switch (tag) {
        case "slot":
        case "target":
            let attribute = option.attr;
            if (!attribute) {
                attribute = option.attr = {};
            }
            if (!attribute.name) {
                attribute.name = {
                    v: DEFAULT_SLOT_NAME
                };
            }
            return ctx['_createNativeComponent_'](tag, childs, option);
    }

    const savedComponent = ctx.children[tag] || ctx['_app_']['_component_'][tag];
    if (savedComponent) {

        const renderComponent = (comp) => {
            const component: Component = createComponent(comp, ctx['_app_']);
            const htmlAttributes = ctx['_initComp_'](component as any, option);
            executeRender(component);
            let element = component.element;
            let targetSlot = component.find(`slot[name='default']`) || (element.tagName.match(/slot/i) ? element : null);
            if (targetSlot) {
                childs.forEach(item => {
                    if (item.tagName === "TARGET") {
                        const namedSlot = component.find(`slot[name='${item.getAttribute("name")}']`);
                        if (namedSlot) {
                            targetSlot = namedSlot;
                        }
                    }
                    const targetSlotParent = targetSlot.parentElement;
                    if (targetSlotParent) {
                        // nodeType -3 : TextNode
                        if (item.nodeType === 3) {
                            insertBefore(targetSlotParent, item, targetSlot.nextSibling);
                        }
                        else {
                            item.childNodes.forEach(child => {
                                insertBefore(targetSlotParent, child, targetSlot.nextSibling);
                            });
                        }
                        targetSlot.remove();
                    }
                    else {
                        element = component.element = item;
                    }
                });
            }

            (htmlAttributes || []).forEach(item => {
                switch (item.key) {
                    case 'class':
                        item.value = (getAttribute(element, item.key) || '') + ' ' + item.value;
                        break;
                    case 'style':
                        item.value = (getAttribute(element, item.key) || '') + item.value;
                }
                setAttribute(element, item.key, item.value);
            });
            return element;
        };
        const compPromise = loadComponent(savedComponent);
        if (compPromise instanceof Promise) {
            const el = createCommentNode();
            compPromise.then(comp => {
                const newEl = renderComponent(comp);
                replaceEl(
                    el as any,
                    newEl,
                );
            }).catch((err) => {
                emitError.call(ctx, err, true);
            });
            return el;
        }
        return renderComponent(compPromise);
    }
    if (tag === "in-place") {
        return handleInPlace.call(ctx, childs, option);
    }
    new Logger(ERROR_TYPE.InvalidComponent, {
        tag: tag
    }).throwPlain();
};


Component.prototype['_createNativeComponent_'] = function (tag: string, htmlChilds: HTMLElement[], option?: IElementOption): HTMLElement {

    const element = document.createElement(tag) as HTMLElement;
    htmlChilds.forEach(item => {
        element.appendChild(item);
    });

    if (option) {
        const ctx: Component = this;
        ctx['_handleAttr_'](element, false, option);

        // register events
        forEachEvent.call(ctx, option.on, (eventName, listener) => {
            addEventListener(
                element, eventName, listener,
            );
        });

        ctx['_handleDir_'](element, option.dir, false, option.rcm);
    }


    return element;
};

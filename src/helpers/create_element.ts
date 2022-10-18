import { createCommentNode } from "./create_coment_node";
import { HTML_TAG, ERROR_TYPE } from "../enums";
import { DEFAULT_SLOT_NAME } from "../constant";
import { executeRender, replaceEl, createComponent, ILazyComponentPayload, addEventListener, insertBefore, findElement, createDocumentFragment } from "../utils";
import { Component } from "../abstracts";
import { handleInPlace } from "./handle_in_place";
import { emitError } from "./emit_error";
import { Logger } from "./logger";
import { forEachEvent } from "./for_each_event";
import "./handle_attribute";
import "./handle_directive";
import "./handle_expression";
import { IElementOption } from "../interface";
import { setComponentMount } from "./set_component_mount";

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

        const renderComponent = (compClass) => {
            const component: Component = createComponent(compClass, ctx['_app_']);
            const componentOption = ctx['_initComp_'](component as any, option);
            let element = executeRender(component, childs);

            let targetSlot = findElement(element, `slot[name='default']`) || (element.tagName.match(/slot/i) ? element : null);
            if (targetSlot) {
                const documentFrag = createDocumentFragment();
                let targetSlotParent = targetSlot.parentElement;
                const removeSlot = () => {
                    // insert fragment doc
                    insertBefore(targetSlotParent, documentFrag, targetSlot.nextSibling);
                    // remove current slot
                    targetSlot.remove();
                };
                childs.forEach(item => {
                    if (item.tagName === "TARGET") {
                        const namedSlot = findElement(element, `slot[name='${item.getAttribute("name")}']`);
                        if (namedSlot !== targetSlot) {
                            removeSlot();
                            targetSlot = namedSlot;
                            targetSlotParent = targetSlot.parentElement;
                        }
                    }
                    // const targetSlotParent = targetSlot.parentElement;
                    if (targetSlotParent) {

                        const insertSlot = (slotEl: HTMLElement) => {
                            documentFrag.appendChild(slotEl);
                        };

                        // nodeType -3 : TextNode
                        if (item.tagName === 'TARGET') {
                            item.childNodes.forEach(insertSlot);
                        }
                        else {
                            insertSlot(item);
                        }

                    }
                    else { // this is needed in case of fragment
                        element = item;
                    }
                });
                if (targetSlotParent) {
                    removeSlot();
                }
            }

            ctx['_handleAttr_'](
                element, false, componentOption
            );
            setComponentMount(component, element);
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

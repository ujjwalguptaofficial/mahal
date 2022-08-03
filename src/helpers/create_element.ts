import { createCommentNode } from "./create_coment_node";
import { HTML_TAG, ERROR_TYPE } from "../enums";
import { DEFAULT_SLOT_NAME } from "../constant";
import { handleAttribute } from "./handle_attribute";
import { initComponent, executeRender, replaceEl, getAttribute, setAttribute, createComponent, ILazyComponentPayload, addEventListener, insertBefore } from "../utils";
import { handleDirective } from "./handle_directive";
import { Component } from "../abstracts";
import { handleInPlace } from "./handle_in_place";
import { emitError } from "./emit_error";
import { Logger } from "./logger";
import { forEachEvent } from "./for_each_event";

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


function createNativeComponent(tag: string, htmlChilds: HTMLElement[], option): HTMLElement {


    const element = document.createElement(tag) as HTMLElement;
    htmlChilds.forEach(item => {
        element.appendChild(item);
    });


    handleAttribute.call(this, element, option.attr, false);

    // register events
    forEachEvent.call(this, option.on, (eventName, listener) => {
        addEventListener(
            element, eventName, listener,
        );
    });

    handleDirective.call(this, element, option.dir, false);
    return element;
}



export function createElement(this: Component, tag: string, childs: HTMLElement[], option): HTMLElement | Comment {
    if (tag == null) {
        return createCommentNode();
    }


    if (HTML_TAG.has(tag)) {
        return createNativeComponent.call(this, tag, childs, option);
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
            return createNativeComponent.call(this, tag, childs, option);
    }

    const savedComponent = this.children[tag] || this['__app__']['_components'][tag];
    if (savedComponent) {

        const renderComponent = (comp) => {
            const component: Component = createComponent(comp, this['__app__']);
            const htmlAttributes = initComponent.call(this, component as any, option);
            executeRender(component, childs);
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
                emitError.call(this, err, true);
            });
            return el;
        }
        return renderComponent(compPromise);
    }
    if (tag === "in-place") {
        return handleInPlace.call(this, childs, option);
    }
    new Logger(ERROR_TYPE.InvalidComponent, {
        tag: tag
    }).throwPlain();
}

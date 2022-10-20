import { createCommentNode } from "./create_coment_node";
import { HTML_TAG, ERROR_TYPE } from "../enums";
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
import { handleSlot } from "./handle_slot";

export const createElement = function (this: Component, tag: string, childs: HTMLElement[], option): HTMLElement | Comment {

    switch (tag) {
        case null:
        case undefined:
            return createCommentNode();
        case 'in-place':
            return handleInPlace.call(this, childs, option);
        default:
            const ctx = this;
            const savedComponent = ctx.children[tag] || ctx['_app_']['_component_'][tag];
            if (savedComponent) {
                const renderComponent = (compClass) => {
                    const component: Component = createComponent(compClass, ctx['_app_']);
                    const componentOption = ctx['_initComp_'](component as any, option);
                    let element = executeRender(component, childs);
                    if (element.tagName === 'SLOT') {
                        element = childs[0];
                    }
                    else {
                        handleSlot(element, childs);
                    }
                    if (componentOption) {
                        ctx['_handleAttr_'](
                            element, false, componentOption
                        );
                    }
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

            if (process.env.NODE_ENV !== 'production') {
                if (!HTML_TAG.has(tag)) {
                    new Logger(ERROR_TYPE.InvalidComponent, {
                        tag: tag
                    }).throwPlain();
                }
            }
            return ctx['_createNativeComponent_'](tag, childs, option);
    }
};

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

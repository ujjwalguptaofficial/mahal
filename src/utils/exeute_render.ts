import { createTextNode, Logger, onElDestroy, addRc, clearAll, createElement } from "../helpers";
import { Component } from "../abstracts";
import { ERROR_TYPE } from "../enums";
import { IRenderContext } from "../interface";
import { createDocumentFragment, removeEl, replaceEl } from "./dom";
import { MAHAL_KEY } from "../constant";

const createTextNodeWithRc = (rcKey, element: Text, addRc_) => {
    addRc_(rcKey, (newValue) => {
        element.nodeValue = newValue;
    });
    return element;
};

const handleExpWithRc = (rcKeys: string[], exp: Function, addRc_) => {
    let element = exp();
    addRc_(rcKeys, () => {
        const newElement = exp();
        const isPatched = replaceEl(element, newElement);
        if (!isPatched) {
            if (element['_setVal_']) {
                newElement['_setVal_'] = element['_setVal_'];
                newElement['_rc_'] = element['_rc_'];
                newElement[MAHAL_KEY] = element[MAHAL_KEY];
            }
            element = newElement;
        }
    });
    return element;
};

const handleForExpWithRc = (rcKeys: string[], exp: Function, addRc_) => {
    let elements: HTMLElement[] = exp();
    addRc_(rcKeys, () => {
        const refNode = elements[0];
        for (let i = 1, oldValueCount = elements.length; i < oldValueCount; i++) {
            const el = elements[i] as any;
            removeEl(el);
        }
        const newElements: HTMLElement[] = exp();
        const fragDoc = createDocumentFragment();
        fragDoc.append(...newElements);
        replaceEl(
            refNode,
            fragDoc as any
        );
        elements = newElements;
    });
    return elements;
};



const renderContext: IRenderContext = {
    createTextNode: createTextNode,
    addRc: addRc,
    createTextNodeWithRc: createTextNodeWithRc,
    handleExpWithRc: handleExpWithRc,
    createEl: createElement,
    handleForExpWithRc: handleForExpWithRc
};

export const executeRender = (comp: Component, children) => {
    const renderFn = comp['_render_']();
    const el: HTMLElement = renderFn.call(comp, renderContext);
    onElDestroy(el, clearAll.bind(comp));
    return el;
};

Component.prototype['_render_'] = function (this: Component): () => HTMLElement {
    if (process.env.NODE_ENV !== "production") {
        return this.render || (() => {
            const createRenderer = this['_app_']['_compileTemplate_'];
            if (!createRenderer) {
                new Logger(ERROR_TYPE.RendererNotFound).throwPlain();
            }
            return createRenderer(this.template);
        })();
    }
    else {
        return this.render || this['_app_']['_compileTemplate_'](this.template);
    }
};


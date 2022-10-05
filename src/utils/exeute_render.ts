import { createTextNode, Logger, onElDestroy, addRc, clearAll } from "../helpers";
import { Component } from "../abstracts";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { IRenderContext } from "../interface";
import { replaceEl } from "./dom";
import { MAHAL_KEY } from "../constant";

const createTextNodeWithRc = (rcKey, element: Text, addRc_) => {
    addRc_(rcKey, (newValue) => {
        element.nodeValue = newValue;
    });
    return element;
};
const handleExpWithRc = (rcKeys: string[], exp: Function, addRc_) => {
    let element = exp();
    rcKeys.forEach(rcKey => {
        addRc_(rcKey, (newValue) => {
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
    });
    return element;
};


const renderContext: IRenderContext = {
    createTextNode: createTextNode,
    addRc: addRc,
    createTextNodeWithRc: createTextNodeWithRc,
    handleExpWithRc: handleExpWithRc
};

export const executeRender = (comp: Component) => {
    const renderFn = comp['_render_']();
    const el: HTMLElement = renderFn.call(comp, renderContext);
    comp.element = el;
    onElDestroy(el, clearAll.bind(comp));
    comp.emit(LIFECYCLE_EVENT.Mount);
    comp.isMounted = true;
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


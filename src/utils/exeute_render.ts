import { createTextNode, Logger, onElDestroy, addRc, clearAll } from "../helpers";
import { Component } from "../abstracts";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { IRenderContext } from "../interface";
import { replaceEl } from "./dom";
import { MAHAL_KEY } from "../constant";

const createTextNodeWithRc = (rcKey, element: Text, addRc_) => {
    addRc_(rcKey, (newValue, el) => {
        el.nodeValue = newValue;
    }, element);
    return element;
};

const handleExpWithRc = (rcKeys: string[], exp: Function, addRc_) => {
    const element = exp();
    rcKeys.forEach(rcKey => {
        addRc_(rcKey, (_, oldEl, rcMeta) => {
            const newElement = exp();
            const isPatched = replaceEl(oldEl, newElement);
            if (!isPatched) {
                if (oldEl['_setVal_']) {
                    newElement['_setVal_'] = oldEl['_setVal_'];
                    newElement['_rc_'] = oldEl['_rc_'];
                    newElement[MAHAL_KEY] = oldEl[MAHAL_KEY];
                }
                rcMeta[0] = newElement;
            }
        }, element);
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


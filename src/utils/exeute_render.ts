import { createTextNode, Logger, onElDestroy, addRc, clearAll } from "../helpers";
import { Component } from "../abstracts";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { IRenderContext } from "../interface";



const renderContext: IRenderContext = {
    createTextNode: createTextNode,
    addRc: addRc
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


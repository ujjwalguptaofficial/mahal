import { createTextNode, handleExpression, createElement, clearAll, Logger, onElDestroy } from "../helpers";
import { Component } from "../abstracts";
import { Mahal } from "../mahal";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { IRenderContext } from "../interface";

function getRender(this: Component): () => Promise<HTMLElement> {
    return this.render || (() => {
        if (process.env.NODE_ENV !== "prodution") {
            if (!(Mahal as any).createRenderer) {
                new Logger(ERROR_TYPE.RendererNotFound).throwPlain();
            }
        }
        return (Mahal as any).createRenderer(this.template);
    })();
}

function addRc(this: object, key, el) {
    if (!this[key]) {
        this[key] = [el];
    }
    else {
        this[key].push(el);
    }
    return el;
}

export const executeRender = (comp: Component, children?) => {
    const renderFn = getRender.call(comp);
    const el: HTMLElement = renderFn.call(comp, {
        createElement: createElement.bind(comp),
        createTextNode: createTextNode.bind(comp),
        format: comp.format.bind(comp),
        runExp: handleExpression.bind(comp),
        children: children || [],
        addRc: addRc
        // runForExp: this.handleForExp_.bind(this)
    } as IRenderContext);
    comp.element = el;
    const clear = clearAll.bind(comp);

    onElDestroy(el, clear);
    comp.emit(LIFECYCLE_EVENT.Mount);
    comp.isMounted = true;
    return el;
};
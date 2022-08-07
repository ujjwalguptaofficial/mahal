import { createTextNode, handleExpression, createElement, clearAll, Logger, onElDestroy } from "../helpers";
import { Component } from "../abstracts";
import { Mahal } from "../mahal";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { IRenderContext } from "../interface";

function getRender(this: Component): () => Promise<HTMLElement> {
    if (process.env.NODE_ENV !== "production") {
        return this.render || (() => {
            if (!(Mahal as any).createRenderer) {
                new Logger(ERROR_TYPE.RendererNotFound).throwPlain();
            }
            return (Mahal as any).createRenderer(this.template);
        })();
    }
    else {
        return this.render || (Mahal as any).createRenderer(this.template);
    }
}

function addRc(this: Map<string, HTMLElement[]>, key, el) {
    const val = this.get(key);
    if (!val) {
        this.set(key, [el]);
    }
    else {
        val.push(el);
    }
    return el;
}

export const executeRender = (comp: Component, children?) => {
    const renderFn = getRender.call(comp);
    const el: HTMLElement = renderFn.call(comp, {
        createElement: createElement.bind(comp),
        createTextNode: createTextNode,
        format: comp.format.bind(comp),
        runExp: handleExpression.bind(comp),
        children: children || [],
        addRc: addRc
    } as IRenderContext);
    comp.element = el;
    const clear = clearAll.bind(comp);

    onElDestroy(el, clear);
    comp.emit(LIFECYCLE_EVENT.Mount);
    comp.isMounted = true;
    return el;
};
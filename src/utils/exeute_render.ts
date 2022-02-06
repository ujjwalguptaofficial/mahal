import { createTextNode, handleExpression, createElement, clearAll } from "../helpers";
import { Component } from "../abstracts";
import { Mahal } from "../mahal";
import { Logger, nextTick } from "../utils";
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

export const executeRender = (comp: Component, children?): Promise<any> => {
    const renderFn = getRender.call(comp);
    return renderFn.call(comp, {
        createElement: createElement.bind(comp),
        createTextNode: createTextNode.bind(comp),
        format: comp.format.bind(comp),
        runExp: handleExpression.bind(comp),
        children: children || []
        // runForExp: this.handleForExp_.bind(this)
    } as IRenderContext).then((el: HTMLElement) => {
        comp.element = el;
        const clear = clearAll.bind(comp);
        el.addEventListener(LIFECYCLE_EVENT.Destroy, clear);
        comp.emit(LIFECYCLE_EVENT.Mount);
        comp.isMounted = true;
        comp.on(LIFECYCLE_EVENT.Destroy, () => {
            el.removeEventListener(LIFECYCLE_EVENT.Destroy, clear);
        });
        return el;
    });
};
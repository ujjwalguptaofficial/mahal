import { createTextNode, handleExpression, createElement, clearAll } from "../helpers";
import { Component } from "../abstracts";
import { App } from "../app";
import { Logger, nextTick } from "../utils";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { IRenderContext } from "../interface";

function getRender(this: Component): () => Promise<HTMLElement> {
    return this.render || (() => {
        if (process.env.NODE_ENV !== "prodution") {
            if (!(App as any).createRenderer) {
                new Logger(ERROR_TYPE.RendererNotFound).throwPlain();
            }
        }
        return (App as any).createRenderer(this.template);
    })();
}

export function executeRender(comp: Component, children?) {
    const renderFn = getRender.call(comp);
    return new Promise<HTMLElement>((res, rej) => {
        renderFn.call(comp, {
            createElement: createElement.bind(comp),
            createTextNode: createTextNode.bind(comp),
            format: comp.format.bind(comp),
            runExp: handleExpression.bind(comp),
            children: children || []
            // runForExp: this.handleForExp_.bind(this)
        } as IRenderContext).then((el: HTMLElement) => {
            comp.element = el;
            res(el);
            setTimeout(() => {
                // if ((this as any).$store) {
                //     for (let key in this.dependency_) {
                //         if (key.indexOf("$store.state") >= 0) {
                //             const cb = (newValue, oldValue) => {
                //                 this.updateDOM_(key, oldValue);
                //             };
                //             key = key.replace("$store.state.", '');
                //             (this as any).$store.watch(key, cb);
                //             this.storeWatchCb_.push({
                //                 key, cb
                //             });
                //         }
                //     }
                // }
                const clear = clearAll.bind(comp);
                el.addEventListener(LIFECYCLE_EVENT.Destroy, clear);
                comp.emit(LIFECYCLE_EVENT.Mount);
                comp.isMounted = true;
                comp.on(LIFECYCLE_EVENT.Destroy, () => {
                    el.removeEventListener(LIFECYCLE_EVENT.Destroy, clear);
                });
            }, 0);
        }).catch(rej);
    })

}
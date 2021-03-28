import { createTextNode, handleExpression, createElement } from "../helpers";
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

export function executeRender(this: Component, children?) {
    const renderFn = getRender.call(this);
    return new Promise((res) => {
        renderFn.call(this, {
            createElement: createElement.bind(this),
            createTextNode: createTextNode.bind(this),
            format: this.format.bind(this),
            runExp: handleExpression.bind(this),
            children: children || []
            // runForExp: this.handleForExp_.bind(this)
        } as IRenderContext).then(el => {
            this.element = el;
            res(el);
            nextTick(() => {
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
                el.addEventListener(LIFECYCLE_EVENT.Destroyed, (this as any).clearAll_);
                this.emit(LIFECYCLE_EVENT.Rendered);
                this.emit(LIFECYCLE_EVENT.Mount);
                this.isMounted = true;
            });
        })

    })

}
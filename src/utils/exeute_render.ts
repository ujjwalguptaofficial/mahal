import { createTextNode, handleExpression, createElement } from "../helpers";
import { Component } from "../abstracts";
import { App } from "../app";
import { Logger, nextTick } from "../utils";
import { ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { IRenderContext } from "../interface";

function getRender(this: Component) {
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
    this.element = renderFn.call(this, {
        createElement: createElement.bind(this),
        createTextNode: createTextNode,
        format: this.format.bind(this),
        runExp: handleExpression.bind(this),
        children: children || []
        // runForExp: this.handleForExp_.bind(this)
    } as IRenderContext
    );
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
        this.element.addEventListener(LIFECYCLE_EVENT.Destroyed, (this as any).clearAll_);
    });
    return this.element;
}
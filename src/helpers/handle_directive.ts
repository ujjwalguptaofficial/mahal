import { Component } from "../abstracts";
import { forEach, nextTick } from "../utils";
import { IDirectiveBinding, IDirective } from "../interface";
import { onElDestroy } from "../helpers";
import { COMPONENT_APP } from "../constant";

export function handleDirective(this: Component, element: HTMLElement, dir, isComponent) {
    if (!dir) return;
    forEach(dir, (compiledDir: IDirectiveBinding, name) => {
        const storedDirective = this['__directive__'][name] || this[COMPONENT_APP]['_directives'][name];
        if (!storedDirective) return;

        compiledDir.isComponent = isComponent;

        const directive: IDirective = storedDirective.call(this, element, compiledDir);

        // call directive async, this will create element faster
        // also nextTick make sure that element is now inserted
        nextTick(_ => {
            const htmlEl = isComponent ? (element as any as Component).element : element;
            if (!directive || !htmlEl.isConnected) return;

            if (directive.inserted) {
                directive.inserted();
            }

            const props = compiledDir.props;
            const directiveUpdate = directive.valueUpdated;
            if (props.length === 0 || directiveUpdate == null) return;
            const methods = [];
            const onDestroyed = () => {
                props.forEach((prop, index) => {
                    this.unwatch(prop, methods[index]);
                });
                if (directive.destroyed) {
                    directive.destroyed();
                }
            };

            onElDestroy(htmlEl, onDestroyed);
            props.forEach((prop, index) => {
                const method = (newValue) => {
                    nextTick(__ => {
                        if (htmlEl.isConnected) {
                            compiledDir.value[index] = newValue;
                            directiveUpdate();
                        }
                    });
                };
                this.watch(prop, method);
                methods.push(method);
            });
        });
    });
}
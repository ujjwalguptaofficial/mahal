import { Component } from "../abstracts";
import { forEach, nextTick } from "../utils";
import { IDirectiveBinding, IDirective } from "../interface";
import { onElDestroy } from "./on_el_destroy";

export function handleDirective(this: Component, element: HTMLElement, dir, isComponent) {
    if (!dir) return;
    const htmlEl = isComponent ? (element as any as Component).element : element;
    forEach(dir, (compiledDir: IDirectiveBinding, name) => {
        const storedDirective = this['__directive__'][name] || this['__app__']['_directives'][name];
        if (!storedDirective) return;

        compiledDir.isComponent = isComponent;

        const directive: IDirective = storedDirective.call(this, element, compiledDir);

        // call directive async, this will create element faster
        // also nextTick make sure that element is now inserted
        nextTick(() => {
            if (!directive || !htmlEl.isConnected) return;

            if (directive.inserted) {
                directive.inserted();
            }

            const props = compiledDir.props;
            const directiveUpdate = directive.valueUpdated;
            if (props.length === 0 || directiveUpdate == null) return;
            let eventsId: number[];
            const onDestroyed = () => {
                props.forEach((prop, index) => {
                    this.unwatch(prop, eventsId[index]);
                });
                if (directive.destroyed) {
                    directive.destroyed();
                }
            };

            onElDestroy(htmlEl, onDestroyed);
            eventsId = props.map((prop, index) => {
                return this.watch(prop, (newValue) => {
                    nextTick(_ => {
                        if (htmlEl.isConnected) {
                            compiledDir.value[index] = newValue;
                            directiveUpdate();
                        }
                    });
                });
            });
        });
    });
}
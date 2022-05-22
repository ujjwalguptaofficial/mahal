import { Component } from "../abstracts";
import { forOwn, merge, nextTick } from "../utils";
import { IDirectiveBinding, IDirective } from "../interface";
import { genericDirective } from "../generics";
import { LIFECYCLE_EVENT } from "../enums";
import { onElDestroy } from "./on_el_destroy";

const destroyEvent = LIFECYCLE_EVENT.Destroy;

export function handleDirective(this: Component, element: HTMLElement, dir, isComponent) {
    if (!dir) return;
    const onEvent = isComponent ? 'on' : 'addEventListener';
    forOwn(dir, (name, compiledDir) => {
        const storedDirective = this['__directive__'][name] || this['__app__']['_directives'][name];
        if (storedDirective) {
            const binding: IDirectiveBinding = compiledDir;
            binding.isComponent = isComponent;

            const directive: IDirective = merge(genericDirective,
                storedDirective.call(this, element, binding));
            // call directive async, this will create element faster
            nextTick(() => {

                let eventsId: number[];
                const props = compiledDir.props;
                const onDestroyed = () => {
                    props.forEach((prop, index) => {
                        this.unwatch(prop, eventsId[index]);
                    });
                    directive.destroyed();
                    // if (!isComponent) {
                    //     element.removeEventListener(destroyEvent, onDestroyed);
                    // }
                    // eventCbs = element = null;
                };
                if (isComponent) {
                    element[onEvent](destroyEvent, onDestroyed);
                    eventsId = props.map((prop, index) => {
                        return this.watch(prop, (newValue, oldValue) => {
                            if (oldValue === newValue) return;
                            binding.value[index] = newValue;
                            directive.valueUpdated();
                        });
                    });
                }
                else {
                    onElDestroy(element, onDestroyed);
                    eventsId = props.map((prop, index) => {
                        return this.watch(prop, (newValue, oldValue) => {
                            if (oldValue === newValue) return;
                            if (element.isConnected) {
                                binding.value[index] = newValue;
                                directive.valueUpdated();
                            }
                        });
                    });
                }
                directive.inserted();
            });
        }
    });
}
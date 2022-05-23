import { Component } from "../abstracts";
import { forOwn, merge, nextTick } from "../utils";
import { IDirectiveBinding, IDirective } from "../interface";
import { genericDirective } from "../generics";
import { LIFECYCLE_EVENT } from "../enums";
import { onElDestroy } from "./on_el_destroy";

const destroyEvent = LIFECYCLE_EVENT.Destroy;

export function handleDirective(this: Component, element: HTMLElement, dir, isComponent) {
    if (!dir) return;
    forOwn(dir, (name, compiledDir) => {
        const storedDirective = this['__directive__'][name] || this['__app__']['_directives'][name];
        if (storedDirective) {
            const binding: IDirectiveBinding = compiledDir;
            binding.isComponent = isComponent;

            const directive: IDirective = merge(
                genericDirective,
                storedDirective.call(this, element, binding)
            );
            // call directive async, this will create element faster
            nextTick(() => {
                let eventsId: number[];
                const props = compiledDir.props;
                const onDestroyed = () => {
                    props.forEach((prop, index) => {
                        this.unwatch(prop, eventsId[index]);
                    });
                    directive.destroyed();
                };
                const onValidUpdate = (index, newValue) => {
                    binding.value[index] = newValue;
                    directive.valueUpdated();
                };
                if (isComponent) {
                    (element as any).on(destroyEvent, onDestroyed);
                    eventsId = props.map((prop, index) => {
                        return this.watch(prop, (newValue, oldValue) => {
                            // if (oldValue === newValue) return;
                            onValidUpdate(index, newValue);
                        });
                    });
                }
                else {
                    onElDestroy(element, onDestroyed);
                    eventsId = props.map((prop, index) => {
                        return this.watch(prop, (newValue, oldValue) => {
                            // if (oldValue === newValue) return;
                            if (element.isConnected) {
                                onValidUpdate(index, newValue);
                            }
                        });
                    });
                }
                directive.inserted();
            });
        }
    });
}
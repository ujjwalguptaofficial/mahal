import { Component } from "../abstracts";
import { forOwn, merge, nextTick } from "../utils";
import { IDirectiveBinding, IDirective } from "../interface";
import { genericDirective } from "../generics";
import { LIFECYCLE_EVENT } from "../enums";

export function handleDirective(this: Component, element, dir, isComponent) {
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
                const destroyEvent = LIFECYCLE_EVENT.Destroy;

                let eventCbs = [];
                const props = compiledDir.props;
                const onDestroyed = () => {
                    props.forEach((prop, index) => {
                        this.unwatch(prop, eventCbs[index]);
                    });
                    directive.destroyed();
                    // if (!isComponent) {
                    //     element.removeEventListener(destroyEvent, onDestroyed);
                    // }
                    // eventCbs = element = null;
                };
                element[onEvent](destroyEvent, onDestroyed);
                props.forEach((prop, index) => {
                    const ev = (newValue, oldValue) => {
                        if (oldValue === newValue) return;
                        binding.value[index] = newValue;
                        directive.valueUpdated();
                    };
                    this.watch(prop, ev);
                    eventCbs.push(ev);
                });
                directive.inserted();
            });
        }
    });
}
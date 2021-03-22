import { Component } from "../abstracts";
import { forOwn, merge, nextTick } from "../utils";
import { globalDirectives } from "../constant";
import { IDirectiveBinding, IDirective } from "../interface";
import { genericDirective } from "../generics";
import { LIFECYCLE_EVENT } from "../enums";

export function handleDirective(this: Component, element, dir, isComponent) {
    if (!dir) return;
    forOwn(dir, (name, compiledDir) => {
        const storedDirective = (this as any).directive_[name] || globalDirectives[name];
        if (storedDirective) {
            const binding = {
                input: compiledDir.input,
                params: compiledDir.params,
                isComponent: isComponent,
                props: compiledDir.props,
                value: compiledDir.value()
            } as IDirectiveBinding;

            const directive: IDirective = merge(genericDirective,
                storedDirective.call(this, element, binding));
            nextTick(() => {
                const onValueUpdated = () => {
                    binding.value = compiledDir.value();
                    directive.valueUpdated();
                };
                const onDestroyed = () => {
                    directive.destroyed();
                    if (!isComponent) {
                        element.removeEventListener(LIFECYCLE_EVENT.Destroyed, onDestroyed);
                    }
                    compiledDir.props.forEach((prop) => {
                        this.unwatch(prop, onValueUpdated);
                    });
                    element = null;
                };
                if (isComponent) {
                    (element as Component).on(LIFECYCLE_EVENT.Destroyed, onDestroyed);
                }
                else {
                    element.addEventListener(LIFECYCLE_EVENT.Destroyed, onDestroyed);
                }
                compiledDir.props.forEach((prop) => {
                    this.watch(prop, onValueUpdated);
                });
                directive.inserted();
            });
        }
    });
}
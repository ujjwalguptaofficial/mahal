import { Component } from "../abstracts";
import { OBJECT_MUTABLE_METHODS } from "../constant";
import { LIFECYCLE_EVENT } from "../enums";
import { forEachEvent } from "../helpers";
import { IElementOption } from "../interface";
import { getDataype } from "./get_data_type";

export function initComponent(this: Component, component: Component, option) {
    component.onInit();

    let componentOption: IElementOption;

    if (option) {

        componentOption = this['_handleAttr_'](component, true, option);
        this['_handleDir_'](component as any, option.dir, true);

        // register events
        forEachEvent.call(this, option.on, (eventName, listener) => {
            component.on(eventName, listener);
        });

    }


    const computed = component['_computed_'];
    for (const key in computed) {
        const data = computed[key];
        let computedValue = data.fn.call(component);
        Object.defineProperty(component, key, {
            get() {
                return computedValue;
            },
            set(newValue) {
                computedValue = newValue;
            }
        });
        data.args.forEach(arg => {
            let eventsToWatch = [arg];
            switch (getDataype(component[arg])) {
                case "array":
                case "object":
                    eventsToWatch = eventsToWatch.concat(
                        OBJECT_MUTABLE_METHODS.map(ev => {
                            return `${arg}.${ev}`;
                        })
                    ); break;

            }
            eventsToWatch.forEach(ev => {
                component.watch(ev, () => {
                    const newValue = data.fn.call(component);
                    component.setState(key, newValue, computedValue);
                    computedValue = newValue;
                });
            });
        });
    }
    component.emit(LIFECYCLE_EVENT.Create);
    return componentOption;
}

Component.prototype['_initComp_'] = initComponent;
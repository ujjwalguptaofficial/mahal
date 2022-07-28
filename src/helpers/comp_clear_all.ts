import { LIFECYCLE_EVENT } from "../enums";
import { Component } from "../abstracts";

const destroyEvent = LIFECYCLE_EVENT.Destroy;
export function clearAll(this: Component) {
    this.element['_comp_destroyed_'] = true;
    // need to emit before clearing events
    this.emit(destroyEvent).then(_ => {
        this['__eventBus__'].destroy();
        this['__watchBus__'].destroy();
        if (this['__ob__']) {
            this['__ob__'].destroy();
        }
        this.element = this['__eventBus__'] =
            this['__ob__'] = null;
    });
}

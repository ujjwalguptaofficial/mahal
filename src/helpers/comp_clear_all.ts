import { LIFECYCLE_EVENT } from "../enums";
import { Component } from "../abstracts";

const destroyEvent = LIFECYCLE_EVENT.Destroy;
export function clearAll(this: Component) {
    const ctx = this;
    ctx.element['_comp_destroyed_'] = true;
    // need to emit before clearing events
    ctx.emit(destroyEvent).then(_ => {
        ctx['__eventBus__'].destroy();
        ctx['__watchBus__'].destroy();
        if (ctx['__ob__']) {
            ctx['__ob__'].destroy();
        }
        ctx.element = ctx['__eventBus__'] =
            ctx['__ob__'] = null;
    });
}

import { LIFECYCLE_EVENT } from "../enums";
import { Component } from "../abstracts";

const destroyEvent = LIFECYCLE_EVENT.Destroy;
export function clearAll(this: Component) {
    const ctx = this;
    ctx.element['_comp_destroyed_'] = true;
    // need to emit before clearing events
    ctx.emit(destroyEvent).then(_ => {
        ctx['_evBus_'].destroy();
        ctx['_watchBus_'].destroy();
        if (ctx['_ob_']) {
            ctx['_ob_'].destroy();
        }
        ctx.element = ctx['_evBus_'] =
            ctx['_ob_'] = null;
    });
}

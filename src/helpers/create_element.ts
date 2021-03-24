import { createCommentNode } from "./create_coment_node";
import { emitReplacedBy } from "./emit_render";
import { HTML_TAG, ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { defaultSlotName, globalComponents } from "../constant";
import { handleAttribute } from "./handle_attribute";
import { Logger, isKeyExist, initComponent, executeRender, replaceEl, getAttribute, setAttribute, nextTick } from "../utils";
import { runPromisesInSequence } from "./run_promises_in_sequence";
import { handleDirective } from "./handle_directive";
import { Component } from "../abstracts";
import { handleInPlace } from "./handle_in_place";

export function createElement(this: Component, tag: string, childs: HTMLElement[], option) {
    let element;
    if (tag == null) {
        element = createCommentNode();
        emitReplacedBy.call(this, element);
        return element;
    }
    if (!option.attr) {
        option.attr = {};
    }
    if (HTML_TAG[tag]) {
        switch (tag) {
            case "slot":
            case "target":
                if (!option.attr.name) {
                    option.attr.name = {
                        v: defaultSlotName
                    };
                }
        }

        element = document.createElement(tag) as HTMLElement;
        childs.forEach((item) => {
            element.appendChild(item);
        });

        if (option.html) {
            (element as HTMLElement).innerHTML = option.html;
        }

        handleAttribute.call(this, element, option.attr, false);

        if (option.on) {
            const evListener = {};
            const events = option.on;
            for (const eventName in events) {
                const ev = events[eventName];
                const methods = [];
                ev.modifiers.forEach(item => {
                    switch (item) {
                        case 'prevent':
                            methods.push((e) => {
                                e.preventDefault();
                                return e;
                            }); break;
                        case 'stop':
                            methods.push((e) => {
                                e.stopPropagation();
                                return e;
                            }); break;
                    }
                });
                ev.handlers.forEach(item => {
                    if (item != null) {
                        methods.push(item.bind(this));
                    }
                    else {
                        new Logger(ERROR_TYPE.InvalidEventHandler, {
                            ev: eventName,
                        }).throwPlain();
                    }
                });
                if (eventName === "input" && !ev.isNative) {
                    methods.unshift((e) => {
                        return e.target.value;
                    });
                }
                evListener[eventName] = methods.length > 1 ?
                    (e) => {
                        runPromisesInSequence(methods, e);
                    } :
                    (e) => {
                        methods[0].call(this, e);
                    };

                (element as HTMLDivElement).addEventListener(
                    eventName, evListener[eventName],
                    {
                        capture: isKeyExist(ev.option, 'capture'),
                        once: isKeyExist(ev.option, 'once'),
                        passive: isKeyExist(ev.option, 'passive'),
                    }
                );
            }

            const onElDestroyed = () => {
                element.removeEventListener(LIFECYCLE_EVENT.Destroyed, onElDestroyed);
                for (const ev in evListener) {
                    element.removeEventListener(ev, evListener[ev]);
                }
            };
            element.addEventListener(LIFECYCLE_EVENT.Destroyed, onElDestroyed);
        }

        handleDirective.call(this, element, option.dir, false);
        emitReplacedBy.call(this, element);
        return element;
    }
    const savedComponent = this.children[tag] || globalComponents[tag];
    if (savedComponent) {
        element = createCommentNode(tag);
        new Promise(res => {
            if (savedComponent instanceof Promise) {
                savedComponent.then(comp => {
                    res(comp.default);
                })
            }
            else {
                res(savedComponent);
            }
        }).then((comp: any) => {
            const component: Component = new comp();
            const htmlAttributes = initComponent.call(this, component as any, option);
            component.element = executeRender.call(component, childs);
            replaceEl(element, component.element);
            const cm = element;
            element = component.element;
            let targetSlot = component.find(`slot[name='default']`);
            if (targetSlot) {
                childs.forEach(item => {
                    if (item.tagName === "TARGET") {
                        const namedSlot = component.find(`slot[name='${item.getAttribute("name")}']`);
                        if (namedSlot) {
                            targetSlot = namedSlot;
                        }
                    }
                    const targetSlotParent = targetSlot.parentElement;
                    if (item.nodeType === 3) {
                        targetSlotParent.insertBefore(item, targetSlot.nextSibling);
                    }
                    else {
                        item.childNodes.forEach(child => {
                            targetSlotParent.insertBefore(child, targetSlot.nextSibling);
                        });
                    }
                    targetSlotParent.removeChild(targetSlot);
                });
            }

            (htmlAttributes || []).forEach(item => {
                switch (item.key) {
                    case 'class':
                        item.value = (getAttribute(element, item.key) || '') + ' ' + item.value;
                        break;
                    case 'style':
                        item.value = (getAttribute(element, item.key) || '') + item.value;
                }
                setAttribute(element, item.key, item.value);
            });
            nextTick(() => {
                cm.replacedBy = element;
                emitReplacedBy.call(this, cm);
            })
        })
        return element;
    }
    else if (tag === "in-place") {
        return handleInPlace.call(this, childs, option);
    }
    else {
        new Logger(ERROR_TYPE.InvalidComponent, {
            tag: tag
        }).throwPlain();
    }
    return element;
}

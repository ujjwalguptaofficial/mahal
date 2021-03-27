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
import { emitComponentRender } from "./emit_comp_render";

export async function createElement(this: Component, tag: string, childs: Promise<HTMLElement>[], option): Promise<HTMLElement | Comment> {
    let element: HTMLElement;
    if (tag == null) {
        return createCommentNode();
    }
    if (!option.attr) {
        option.attr = {};
    }
    const htmlChilds = await Promise.all(childs);
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
        htmlChilds.forEach((item) => {
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
        return Promise.resolve(element);
    }
    const savedComponent = this.children[tag] || globalComponents[tag];
    if (savedComponent) {
        const onCompDownload = async (comp: any) => {
            const component: Component = new comp();
            const htmlAttributes = initComponent.call(this, component as any, option);
            await executeRender.call(component, childs);
            element = component.element;
            // replaceEl(element, component.element);
            // const cm = element;
            let targetSlot = component.find(`slot[name='default']`);
            if (targetSlot) {
                htmlChilds.forEach(item => {
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
        }
        return new Promise(res => {
            if (savedComponent instanceof Promise) {
                savedComponent.then(comp => {
                    onCompDownload(comp.default).then(() => {
                        res(element);
                    })
                })
            }
            else {
                onCompDownload(savedComponent).then(() => {
                    res(element);
                });
            }
        })

    }
    else if (tag === "in-place") {
        return handleInPlace.call(this, childs, option);
    }
    else {
        new Logger(ERROR_TYPE.InvalidComponent, {
            tag: tag
        }).throwPlain();
    }
}

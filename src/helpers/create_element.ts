import { createCommentNode } from "./create_coment_node";
import { HTML_TAG, ERROR_TYPE, LIFECYCLE_EVENT } from "../enums";
import { defaultSlotName, globalComponents } from "../constant";
import { handleAttribute } from "./handle_attribute";
import { Logger, isKeyExist, initComponent, executeRender, replaceEl, getAttribute, setAttribute, nextTick } from "../utils";
import { runPromisesInSequence } from "./run_promises_in_sequence";
import { handleDirective } from "./handle_directive";
import { Component } from "../abstracts";
import { handleInPlace } from "./handle_in_place";

function createNativeComponent(tag: string, htmlChilds: HTMLElement[], option): HTMLElement {
    switch (tag) {
        case "slot":
        case "target":
            if (!option.attr.name) {
                option.attr.name = {
                    v: defaultSlotName
                };
            }
    }

    const element = document.createElement(tag) as HTMLElement;
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
    return element;
}

const loadComponent = (savedComponent) => {
    return new Promise(resolve => {
        if (savedComponent instanceof Promise) {
            savedComponent.then(comp => {
                resolve(comp.default);
            })
        }
        else {
            resolve(savedComponent);
        }
    })
}

export function createElement(this: Component, tag: string, childs: Promise<HTMLElement>[], option): Promise<HTMLElement | Comment> {

    return new Promise((res, rej) => {
        if (tag == null) {
            res(createCommentNode());
        }
        if (!option.attr) {
            option.attr = {};
        }
        Promise.all(childs).then(htmlChilds => {
            if (HTML_TAG[tag]) {
                res(createNativeComponent.call(this, tag, htmlChilds, option));
                return;
            }
            const savedComponent = this.children[tag] || globalComponents[tag];
            if (savedComponent) {
                loadComponent(savedComponent).then((comp: any) => {
                    const component: Component = new comp();
                    const htmlAttributes = initComponent.call(this, component as any, option);
                    executeRender(component, childs).then(_ => {
                        const element = component.element;
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
                        res(element);
                    }).catch(rej);
                });
            }
            else if (tag === "in-place") {
                res(handleInPlace.call(this, childs, option));
            }
            else {
                console.log("rejecting error");
                rej(new Logger(ERROR_TYPE.InvalidComponent, {
                    tag: tag
                }).throwPlain(true));
            }
        }).catch(rej);
    });
}

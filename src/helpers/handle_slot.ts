import { ERROR_TYPE } from "../enums";
import { createDocumentFragment, findElement, getAttribute, insertBefore } from "../utils";
import { Logger } from "./logger";
export const handleSlot = (element: HTMLElement, childs: HTMLElement[]) => {

    let targetSlot: HTMLElement = findElement(element, `slot`) as any;
    if (targetSlot) {
        const allSlots = element.querySelectorAll('slot');

        const documentFrag = createDocumentFragment();
        const insertSlot = (slotEl) => {
            documentFrag.appendChild(slotEl);
        };

        let deletedSlotsCount = 0;
        const removeSlot = () => {
            // if document frag does not has any child
            if (!documentFrag.firstChild) {
                targetSlot.childNodes.forEach(insertSlot);
            }
            // insert fragment doc
            insertBefore(
                targetSlot.parentElement as HTMLElement,
                documentFrag,
                targetSlot.nextSibling as HTMLElement
            );

            // remove current slot
            targetSlot.remove();
            ++deletedSlotsCount;
            targetSlot['deleted'] = true;

        };
        childs.forEach(item => {
            if (item.tagName === "TARGET") {
                const namedSlot = findElement(element, `slot[name='${getAttribute(item, "name")}']`);
                if (process.env.NODE_ENV !== 'production') {
                    if (!namedSlot) {
                        const names = [];
                        allSlots.forEach(slot => {
                            names.push(
                                getAttribute(slot, 'name')
                            );
                        });

                        new Logger(ERROR_TYPE.InvalidSlotTarget, {
                            name: getAttribute(item, "name"),
                            names: names
                        }).throwPlain();
                    }
                }
                if (namedSlot !== targetSlot) {
                    if (targetSlot['done']) {
                        removeSlot();
                    }
                    targetSlot = namedSlot as HTMLElement;
                }
                targetSlot['done'] = true;
                item.childNodes.forEach(insertSlot);
            }
            else {
                insertSlot(item);
            }
        });
        removeSlot();
        if (allSlots.length !== deletedSlotsCount) {
            allSlots.forEach((slot) => {
                if (!slot['deleted']) {
                    targetSlot = slot;
                    removeSlot();
                }
            });
        }
    }
};
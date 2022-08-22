import { expect } from "chai";
import { Component, Reactive, Directive } from "mahal";
import { initiate, mount } from "@mahaljs/test-utils";
import { clone } from "../typescript/src/util";
import { Template, Watch } from "@mahaljs/util";

@Template(`
<div>
    <div :if(flag)>
        <div>
            <div>
                <div>
                    <div :for(item in fruits)>
                        <div>
                            <div :dirTest(selected)>{{item}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`)
export class ArrayComp extends Component {
    @Reactive
    fruits = [];

    @Reactive
    flag = true;

    @Reactive
    selected = true;

    initialFruits = ["Banana", "Orange", "Apple", "Mango"]

    initializeFruit() {
        this.fruits = clone(
            this.initialFruits
        )
    }

    constructor() {
        super();
        this.initializeFruit();
    }

    updateCount = 0;

    @Directive()
    dirTest() {
        ++this.updateCount;
        return {
            valueUpdated: () => {
                ++this.updateCount;
            },
        }
    }

    onInit(): void {
        window['temp'] = this;
    }
}

const ARRAY_MUTABLE_METHODS = ["push", "pop", "splice", "shift", "unshift", "reverse"];

describe("Array nested element destroy", () => {
    let component: ArrayComp;
    before(async () => {
        component = await mount<ArrayComp>(ArrayComp);
    })

    it("count events", async () => {
        await new Promise(res => {
            setTimeout(res, 100)
        });
        expect(Object.keys(component['_watchBus_']._events_)).length(12);
        ARRAY_MUTABLE_METHODS.forEach(name => {
            expect(component['_watchBus_']._events_[`fruits.${name}`]).length(1);
        })
        expect(component['_watchBus_']._events_[`fruits`]).length(1);
        expect(component.updateCount).equal(4);
    })

    it('set flag to false', async () => {
        component.flag = false;
        component.selected = false;
        await component.waitFor('update');
        await new Promise(res => {
            setTimeout(res, 100)
        });
        // expect(Object.keys(component['_watchBus_']._events_)).length(2);
        ARRAY_MUTABLE_METHODS.forEach(name => {
            expect(component['_watchBus_']._events_[`fruits.${name}`]).length(0);
        })
        expect(component['_watchBus_']._events_[`fruits`]).length(0);
        expect(component.updateCount).equal(4);
    })

})
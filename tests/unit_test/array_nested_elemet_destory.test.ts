import { expect } from "chai";
import { Component, Template, clone, Reactive, Directive } from "mahal";
import { initiate, mount } from "mahal-test-utils";

@Template(`
<div>
    <div :if(flag)>
        <div>
            <div :for(item in fruits)>
                <div>
                    <div :dirTest(selected)>{{item}}</div>
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
        debugger;
        component = await mount<ArrayComp>(ArrayComp);
    })

    it("count events", async () => {
        await component.timer.timeout(1000);
        expect(Object.keys(component['__watchBus__']._events)).length(12);
        ARRAY_MUTABLE_METHODS.forEach(name => {
            expect(component['__watchBus__']._events[`fruits.${name}`]).length(1);
        })
        expect(component['__watchBus__']._events[`fruits`]).length(1);
        expect(component.updateCount).equal(4);
    })

    it('set flag to false', async () => {
        component.flag = false;
        component.selected = false;
        await component.waitFor('update');
        // expect(Object.keys(component['__watchBus__']._events)).length(2);
        ARRAY_MUTABLE_METHODS.forEach(name => {
            expect(component['__watchBus__']._events[`fruits.${name}`]).length(0);
        })
        expect(component['__watchBus__']._events[`fruits`]).length(0);
        expect(component.updateCount).equal(4);
    })

})
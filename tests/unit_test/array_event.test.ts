import { expect } from "chai";
import { Component, Template, clone, Reactive, Computed } from "mahal";
import { initiate, mount } from "mahal-test-utils";

@Template(`
<div>
    <div :if(flag)>
        <div :for(item in fruits)>{{item}}</div>
    </div>
</div>
`)
class ArrayComp extends Component {
    @Reactive
    fruits = [];

    @Reactive
    flag = true;

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
}

const ARRAY_MUTABLE_METHODS = ["push", "pop", "splice", "shift", "unshift", "reverse"];

describe("Fruit", () => {
    let component: ArrayComp;
    before(async () => {
        component = await mount<ArrayComp>(ArrayComp);
    })

    it("count events", async () => {
        await component.timer.timeout(1000);
        expect(Object.keys(component['__watchBus__']._events)).length(11);
        ARRAY_MUTABLE_METHODS.forEach(name => {
            expect(component['__watchBus__']._events[`fruits.${name}`]).length(1);
        })
        expect(component['__watchBus__']._events[`fruits`]).length(1);
    })

    it('set flag to false', async () => {
        component.flag = false;
        await component.waitFor('update');
        // expect(Object.keys(component['__watchBus__']._events)).length(2);
        ARRAY_MUTABLE_METHODS.forEach(name => {
            expect(component['__watchBus__']._events[`fruits.${name}`]).length(0);
        })
        expect(component['__watchBus__']._events[`fruits`]).length(0);
    })

})
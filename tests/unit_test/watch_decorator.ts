import { Component, Computed } from "mahal";
import { Template, Watch } from "@mahaljs/util";
import { initiate, mount } from "@mahaljs/test-utils";
import { createSandbox, spy } from "sinon";
import { clone } from "../typescript/src/util";

@Template(`
<div>dd</div>
`)
export default class WatchDecorators extends Component {
    fruits = [];

    initialFruits = ["Banana", "Orange", "Apple", "Mango"]

    onInit(): void {
        window['fruitsComp'] = this;
    }

    @Computed('fruits')
    fruitsLength() {
        return this.fruits.length;
    }

    @Computed('fruits')
    fruitsObject() {
        const obj = {};
        this.fruits.forEach(fruit => {
            obj[fruit] = fruit;
        })
        return obj;
    }

    initializeFruit() {
        this.setState('fruits', clone(this.initialFruits));
    }

    @Watch('fruits')
    onFruitsChange(newValue) {
        console.log('onFruitsChange', newValue)
    }
}

describe("Watch decorator", () => {
    let component: WatchDecorators;
    before(async () => {
        component = await mount<WatchDecorators>(WatchDecorators);
    })



    it("initialize fruits", () => {
        let sandbox = createSandbox();
        const spy = sandbox.spy(console, "log");

        // stub.calledOnce(component.onFruitsChange);
        component.initializeFruit();
        sandbox.assert.calledOnceWithExactly(spy, 'onFruitsChange', component.initialFruits);
        sandbox.restore();
        // const promise = new Promise<void>((res) => {
        //     // var eventId = component.watch("fruits", (newValue, oldValue) => {
        //     //     console.log("new value", newValue);
        //     //     expect(newValue).eql(component.initialFruits);
        //     //     expect(oldValue).eql([]);
        //     //     component.unwatch("fruits", eventId);
        //     //     checkFruitValue(
        //     //         component.initialFruits
        //     //     )
        //     //     res();
        //     // });
        //     setTimeout(() => {
        //         sandbox.assert.calledOnce(stub);
        //         res();
        //         sandbox.restore();
        //     }, 1000);
        //     // sandbox.assert.calledOnceWithExactly(component.onFruitsChange as any, component.initialFruits, []);
        // })
        // return promise;
    })
})
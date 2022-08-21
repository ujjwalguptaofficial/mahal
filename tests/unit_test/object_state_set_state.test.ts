import { expect } from "chai";
import { Component, Reactive, Computed } from "mahal";
import { initiate, } from "mahal-test-utils";
import { clone } from "../typescript/src/util";
import { Template, Watch } from "@mahaljs/util";

@Template(`
<div></div>
`)
class ObjComp extends Component {

    fruits = {};

    get initialFruits() {
        return {
            potato: "potato", peas: "peas", spinach: "spinach", brinjal: "brinjal"
        }
    }

    @Computed('fruits')
    fruitsLength() {
        return Object.keys(this.fruits).length;
    }

    @Computed('fruits')
    fruitsArray() {
        return Object.values(this.fruits);
    }

    initializeFruit() {
        this.setState('fruits', clone(
            this.initialFruits
        ))
    }
}

describe("object state using set state", () => {

    let component: ObjComp;
    before(async () => {
        component = await initiate<ObjComp>(ObjComp);
    })

    const checkFruitValue = (value) => {
        const fruitsFromStore = component.fruits;
        expect(Object.keys(value)).length(Object.keys(fruitsFromStore).length);
        expect(component.fruitsLength).equal(Object.keys(value).length);
        expect(component.fruitsArray).eql(Object.values(value));
        expect(value).eql(fruitsFromStore);
    }

    it("initialize fruits", () => {

        const promise = new Promise<void>((res) => {
            var eventId = component.watch("fruits", (newValue, oldValue) => {
                expect(newValue).eql(component.initialFruits);
                expect(oldValue).eql({});
                res();
                component.unwatch("fruits", eventId);
            });
        })
        component.initializeFruit();
        checkFruitValue(
            component.initialFruits
        )
        return promise;
    })

    it("update value", async function () {
        const promise = new Promise<void>((res) => {
            const cb = (newValue) => {
                expect(newValue).eql({ value: 'POTATO', key: 'potato', oldValue: 'potato' });
                res();
                component.unwatch("fruits.update", eventId);
            };
            var eventId = component.watch("fruits.update", cb);
        })
        const veggie = clone(component.initialFruits);
        veggie['potato'] = 'POTATO';
        component.setState(`fruits.potato`, 'POTATO');
        checkFruitValue(veggie);
        return promise;
    })

    it("add value", async function () {
        component.initializeFruit();

        const promise = new Promise<void>((res) => {
            var eventId = component.watch("fruits.add", (newValue) => {
                expect(newValue).eql({ value: 'amrud', key: 'amrud' });
                res();
                component.unwatch("fruits.add", eventId);
            });
        })
        const veggie = clone(component.initialFruits);
        veggie['amrud'] = 'amrud';

        component.setState('fruits.amrud', 'amrud');
        checkFruitValue(veggie);
        return promise;
    })

    it("update value after add", async function () {
        const promise = new Promise<void>((res) => {
            const eventId = component.watch("fruits.update", (newValue) => {
                expect(newValue).eql({ value: 'Amrud', key: 'amrud', oldValue: 'amrud' });
                res();
                component.unwatch("fruits.update", eventId);
            });
        })
        const veggie = clone(component.initialFruits);
        veggie['amrud'] = 'Amrud';
        component.setState('fruits.amrud', 'Amrud');
        checkFruitValue(veggie);
        return promise;
    })

    it("delete value", async function () {
        const promise = new Promise<void>((res) => {
            const eventId = component.watch("fruits.delete", (newValue) => {
                expect(newValue).eql({ key: 'amrud', index: 4 });
                res();
                component.unwatch("fruits.delete", eventId);
            });
        })
        const veggie = clone(component.initialFruits);
        delete veggie['amrud'];

        component.deleteState('fruits.amrud');
        checkFruitValue(veggie);
        return promise;
    })
})
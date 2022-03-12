import { expect } from "chai";
import { Component, Reactive, clone, Computed, Template } from "mahal";
import { initiate, } from "mahal-test-utils";
@Template(`
<div></div>
`)
class ObjComp extends Component {

    @Reactive
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
        return Object.keys(this.fruits);
    }

    initializeFruit() {
        this.fruits = clone(
            this.initialFruits
        )
    }
}

describe("object state", () => {

    let component: ObjComp;
    before(async () => {
        component = await initiate<ObjComp>(ObjComp);
    })

    const checkFruitValue = (value) => {
        const fruitsFromStore = component.fruits;
        expect(Object.keys(value)).length(Object.keys(fruitsFromStore).length);
        expect(component.fruitsLength).equal(Object.keys(value).length);
        expect(component.fruitsArray).eql(Object.keys(value));
        expect(value).eql(fruitsFromStore);
    }

    it("initialize fruits", () => {

        const promise = new Promise<void>((res) => {
            component.watch("fruits", (newValue, oldValue) => {
                expect(newValue).eql(component.initialFruits);
                expect(oldValue).eql({});
                res();
                component.unwatch("fruits");
            });
        })
        component.fruits = clone(
            component.initialFruits
        )
        checkFruitValue(
            component.initialFruits
        )
        return promise;
    })

    it("add value", async function () {
        component.initializeFruit();

        const promise = new Promise<void>((res) => {
            component.watch("fruits.add", (newValue) => {
                expect(newValue).eql({ value: 'amrud', key: 'amrud' });
                res();
                component.unwatch("fruits.add");
            });
        })
        const veggie = clone(component.initialFruits);
        veggie['amrud'] = 'amrud';

        component.fruits['amrud'] = 'amrud';
        checkFruitValue(veggie);
        return promise;
    })

    it("update value", async function () {
        const promise = new Promise<void>((res) => {
            component.watch("fruits.update", (newValue) => {
                expect(newValue).eql({ value: 'Amrud', key: 'amrud' });
                res();
                component.unwatch("fruits.update");
            });
        })
        const veggie = clone(component.initialFruits);
        veggie['amrud'] = 'Amrud';
        component.fruits['amrud'] = 'Amrud';
        checkFruitValue(veggie);
        return promise;
    })

    it("delete value", async function () {
        const promise = new Promise<void>((res) => {
            component.watch("fruits.delete", (newValue) => {
                expect(newValue).eql({ key: 'amrud', index: 4 });
                res();
                component.unwatch("fruits.delete");
            });
        })
        const veggie = clone(component.initialFruits);
        delete veggie['amrud'];
        delete component.fruits['amrud'];
        checkFruitValue(veggie);
        return promise;
    })
})
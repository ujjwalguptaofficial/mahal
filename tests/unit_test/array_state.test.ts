import { expect } from "chai";
import { Component, reactive, computed } from "mahal";
import { initiate } from "@mahaljs/test-utils";
import { clone } from "../typescript/src/util";
import { template, watch } from "@mahaljs/util";

@template(`
<div></div>
`)
class ArrayComp extends Component {
    @reactive
    fruits = [];

    initialFruits = ["Banana", "Orange", "Apple", "Mango"]

    @computed('fruits')
    fruitsLength() {
        return this.fruits.length;
    }

    @computed('fruits')
    fruitsObject() {
        const obj = {};
        this.fruits.forEach(fruit => {
            obj[fruit] = fruit;
        })
        return obj;
    }

    initializeFruit() {
        this.fruits = clone(
            this.initialFruits
        )
    }
}

describe("Array State", () => {
    let component: ArrayComp;
    before(async () => {
        component = await initiate<ArrayComp>(ArrayComp);
    })

    const checkFruitValue = (value) => {
        const fruitsFromcomponent = component.fruits;
        expect(value).length(fruitsFromcomponent.length);
        expect(fruitsFromcomponent.length).equal(value.length);
        expect(component.fruitsLength).equal(value.length);
        expect(value).eql(fruitsFromcomponent);

        const obj = {};
        value.forEach(fruit => {
            obj[fruit] = fruit;
        })
        expect(obj).eql(component.fruitsObject)
    }

    it("initialize fruits", () => {

        const promise = new Promise<void>((res) => {
            var eventId = component.watch("fruits", (newValue, oldValue) => {
                console.log("new value", newValue);
                expect(newValue).eql(component.initialFruits);
                expect(oldValue).eql([]);
                component.unwatch("fruits", eventId);
                checkFruitValue(
                    component.initialFruits
                )
                res();
            });
        })
        component.setState('fruits', clone(component.initialFruits));
        return promise;
    })

    it("push value", async function () {
        component.initializeFruit();
        const promise = new Promise<void>((res) => {
            var eventId = component.watch("fruits.push", (newValue) => {
                expect(newValue).eql(['amrud', 'ddd']);
                checkFruitValue(fruits);
                component.unwatch("fruits.push", eventId);
                res();
            });
        })

        const fruits = clone(component.initialFruits);
        fruits.push('amrud', 'ddd');

        component.fruits.push('amrud', 'ddd');

        return promise;
    })

    it("update value", async function () {
        component.initializeFruit();
        const promise = new Promise<void>((res) => {
            const cb = (newValue) => {
                expect(newValue).eql({ key: '0', value: 'amrud', oldValue: 'Banana' });
                checkFruitValue(fruits);
                component.unwatch("fruits.update", eventId);
                res();
            };
            var eventId = component.watch("fruits.update", cb);
        })
        const fruits = clone(component.initialFruits);
        fruits[0] = 'amrud';
        component.fruits[0] = 'amrud';
        return promise;
    })

    it("splice value by 0,1", async function () {
        component.initializeFruit();
        const promise = new Promise<void>((res) => {
            const cb = (newValue) => {
                expect(newValue).eql([0, 1]);
                checkFruitValue(fruits);
                component.unwatch("fruits.splice", eventId);
                res();
            }
            var eventId = component.watch("fruits.splice", cb);
        })
        const fruits = clone(component.initialFruits);
        fruits.splice(0, 1);

        component.fruits.splice(0, 1);

        return promise;
    })

    it("splice value by 2,1", async function () {
        component.initializeFruit();
        const promise = new Promise<void>((res) => {
            const cb = (newValue) => {
                expect(newValue).eql([2, 1]);
                checkFruitValue(fruits);
                component.unwatch("fruits.splice", eventId);
                res();
            };
            var eventId = component.watch("fruits.splice", cb);
        })
        const fruits = clone(component.initialFruits);
        fruits.splice(2, 1);

        component.fruits.splice(2, 1);

        return promise;
    })

    it(`splice value by 2,2,"Lemon", "Kiwi" `, async function () {
        component.initializeFruit();
        const promise = new Promise<void>((res) => {
            const cb = (newValue) => {
                expect(newValue).eql([2, 2, "Lemon", "Kiwi"]);
                checkFruitValue(fruits);
                component.unwatch("fruits.splice", eventId);
                res();
            };
            var eventId = component.watch("fruits.splice", cb);
        })
        const fruits = clone(component.initialFruits);
        fruits.splice(2, 2, "Lemon", "Kiwi");

        component.fruits.splice(2, 2, "Lemon", "Kiwi");

        return promise;
    })

    it("pop", async function () {
        component.initializeFruit();
        const promise = new Promise<void>((res) => {
            const cb = (newValue) => {
                expect(newValue).eql([]);
                checkFruitValue(fruits);
                component.unwatch("fruits.pop", eventId);
                res();
            };
            var eventId = component.watch("fruits.pop", cb);
        })
        const fruits = clone(component.initialFruits);
        fruits.pop();

        component.fruits.pop();

        return promise;
    })

    it("shift", async function () {
        component.initializeFruit();
        const promise = new Promise<void>((res) => {
            const cb = (newValue) => {
                expect(newValue).eql([]);
                checkFruitValue(fruits);
                component.unwatch("fruits.shift", eventId);
                res();
            };
            var eventId = component.watch("fruits.shift", cb);
        })
        const fruits = clone(component.initialFruits);
        fruits.shift();

        component.fruits.shift();

        return promise;
    })

    it("unshift", async function () {
        component.initializeFruit();
        const promise = new Promise<void>((res) => {
            const cb = (newValue) => {
                expect(newValue).eql(['amrud']);
                checkFruitValue(fruits);
                component.unwatch("fruits.unshift", eventId);
                res();
            };
            var eventId = component.watch("fruits.unshift", cb);
        })
        const fruits = clone(component.initialFruits);
        fruits.unshift('amrud')

        component.fruits.unshift('amrud')

        return promise;
    })

    it("reverse", async function () {
        component.initializeFruit();
        const promise = new Promise<void>((res) => {
            const cb = (newValue) => {
                expect(newValue).eql([]);
                checkFruitValue(fruits);
                component.unwatch("fruits.reverse", eventId);
                res();
            };
            var eventId = component.watch("fruits.reverse", cb);
        })
        const fruits = clone(component.initialFruits);
        fruits.reverse();

        component.fruits.reverse();

        return promise;
    })

    it("update value by setState", async function () {
        component.initializeFruit();
        const fruits = clone(component.initialFruits);
        const promise = new Promise<void>((res) => {
            const cb = (newValue) => {
                expect(newValue).eql({ key: '0', value: 'lichi', oldValue: 'Banana' });
                // console.log("fruits", fruits);
                // console.log("component.fruits", component.fruits);
                checkFruitValue(fruits);
                component.unwatch("fruits.update", eventId);
                res();
            }
            var eventId = component.watch("fruits.update", cb);
        })
        fruits[0] = 'lichi';
        component.setState('fruits.0', 'lichi');
        return promise;
    })
})
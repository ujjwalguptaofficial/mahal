import FruitComponent from "../src/components/fruits_set_state";
import { app } from "../src/index";
import { nextTick, clone } from "mahal";
import { expect } from "chai";

describe('Fruit with set state', function () {

    let component: FruitComponent;

    before(async function () {
        component = await (app as any).mount(FruitComponent);
    });

    const checkFruitValue = (value) => {
        const rows = component.findAll('p');
        expect(value).length(rows.length);
        value.forEach((fruit, index) => {
            expect(rows[index].innerHTML).equal(`${index}-${fruit}`)
        })
    }

    it("check rendered value", function () {
        checkFruitValue(component.initialFruits);
    })

    it("splice value by 0,1", async function () {
        component.setInitial();
        await component.waitFor('update');
        component.setState('fruits.splice', 0, 1);
        await component.waitFor('update');
        const fruits = component.initialFruits;
        fruits.splice(0, 1);
        checkFruitValue(fruits);
    })

    it("splice value by 2,1", async function () {
        component.setInitial();
        await component.waitFor('update');
        component.setState('fruits.splice', 2, 1);
        await component.waitFor('update');
        const fruits = clone(component.initialFruits);
        fruits.splice(2, 1);
        checkFruitValue(fruits);
    })

    it(`splice value by 2,1, "Lemon", "Kiwi" `, async function () {
        component.setInitial();
        await component.waitFor('update');
        component.setState('fruits.splice', 2, 1, "Lemon", "Kiwi");
        await component.waitFor('update');
        const fruits = clone(component.initialFruits);
        fruits.splice(2, 1, "Lemon", "Kiwi");
        checkFruitValue(fruits);
    })

    it(`splice value by 2,0, "Lemon", "Kiwi" `, async function () {
        component.setInitial();
        await component.waitFor('update');
        component.setState('fruits.splice', 2, 0, "Lemon", "Kiwi");
        await component.waitFor('update');
        const fruits = clone(component.initialFruits);
        fruits.splice(2, 0, "Lemon", "Kiwi");
        checkFruitValue(fruits);
    })

    it(`splice value by 2,2, "Lemon", "Kiwi" `, async function () {
        component.setInitial();
        await component.waitFor('update');
        component.setState('fruits.splice', 2, 2, "Lemon", "Kiwi");
        await component.waitFor('update');
        const fruits = clone(component.initialFruits);
        fruits.splice(2, 2, "Lemon", "Kiwi");
        checkFruitValue(fruits);
    })

    it('pop items', async () => {
        component.setInitial();
        await component.waitFor('update');
        component.setState('fruits.pop');
        await component.waitFor('update');
        const fruits = clone(component.initialFruits);
        fruits.pop();
        checkFruitValue(fruits);
    });

    it('shift items', async () => {
        component.setInitial();
        await component.waitFor('update');
        component.setState('fruits.shift');
        await component.waitFor('update');
        const fruits = clone(component.initialFruits);
        fruits.shift();
        checkFruitValue(fruits);
    });

    it('unshift items', async () => {
        component.setInitial();
        await component.waitFor('update');
        component.setState('fruits.unshift', 'amrud');
        await component.waitFor('update');
        const fruits = clone(component.initialFruits);
        fruits.unshift('amrud');
        checkFruitValue(fruits);
    });

    it('reverse items', async () => {
        component.setInitial();
        await component.waitFor('update');
        component.setState('fruits.reverse');
        await component.waitFor('update');
        const fruits = clone(component.initialFruits);
        fruits.reverse();
        checkFruitValue(fruits);
    });
});


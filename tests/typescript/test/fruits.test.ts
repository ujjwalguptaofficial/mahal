import FruitComponent from "../src/components/fruits";
import { app } from "../src/index";
import { expect } from "chai";
import { clone } from "../src/util";


describe('Fruits', function () {

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

    it("push", async function () {
        component.setInitial();
        await component.waitFor('update');
        component.fruits.push('nimbu');
        await component.waitFor('update');
        const fruits = component.initialFruits;
        fruits.push('nimbu');
        checkFruitValue(fruits);
    })

    it("update", async function () {
        component.setInitial();
        await component.waitFor('update');
        component.fruits[component.fruits.length - 1] = 'random'
        await component.waitFor('update');
        const fruits = component.initialFruits;
        fruits[fruits.length - 1] = 'random'
        checkFruitValue(fruits);
    })

    it("update multiple times", async function () {
        component.setInitial();
        await component.waitFor('update');
        component.fruits[component.fruits.length - 1] = 'dfghhh'
        component.fruits[component.fruits.length - 1] = 'dfggg'
        component.fruits[component.fruits.length - 1] = 'frgg'
        await component.waitFor('update');
        const fruits = component.initialFruits;
        fruits[fruits.length - 1] = 'frgg'
        checkFruitValue(fruits);
    })

    it("splice value by 0,1", async function () {
        component.setInitial();
        await component.waitFor('update');
        component.fruits.splice(0, 1);
        await component.waitFor('update');
        const fruits = component.initialFruits;
        fruits.splice(0, 1);
        checkFruitValue(fruits);
    })

    it("splice value by 2,1", async function () {
        component.setInitial();
        await component.waitFor('update');
        component.fruits.splice(2, 1);
        await component.waitFor('update');
        const fruits = clone(component.initialFruits);
        fruits.splice(2, 1);
        checkFruitValue(fruits);
    })

    it(`splice value by 2,1, "Lemon", "Kiwi" `, async function () {
        component.setInitial();
        await component.waitFor('update');
        component.fruits.splice(2, 1, "Lemon", "Kiwi");
        await component.waitFor('update');
        const fruits = clone(component.initialFruits);
        fruits.splice(2, 1, "Lemon", "Kiwi");
        checkFruitValue(fruits);
    })

    it(`splice value by 2,0, "Lemon", "Kiwi" `, async function () {
        component.setInitial();
        await component.waitFor('update');
        component.fruits.splice(2, 0, "Lemon", "Kiwi");
        await component.waitFor('update');
        const fruits = clone(component.initialFruits);
        fruits.splice(2, 0, "Lemon", "Kiwi");
        checkFruitValue(fruits);
    })

    it(`splice value by 2,2, "Lemon", "Kiwi" `, async function () {
        component.setInitial();
        await component.waitFor('update');
        component.fruits.splice(2, 2, "Lemon", "Kiwi");
        await component.waitFor('update');
        const fruits = clone(component.initialFruits);
        fruits.splice(2, 2, "Lemon", "Kiwi");
        checkFruitValue(fruits);
    })

    it('pop items', async () => {
        component.setInitial();
        await component.waitFor('update');
        component.fruits.pop();
        await component.waitFor('update');
        const fruits = clone(component.initialFruits);
        fruits.pop();
        checkFruitValue(fruits);
    });

    it('shift items', async () => {
        component.setInitial();
        await component.waitFor('update');
        component.fruits.shift();
        await component.waitFor('update');
        const fruits = clone(component.initialFruits);
        fruits.shift();
        checkFruitValue(fruits);
    });

    it('unshift items', async () => {
        component.setInitial();
        await component.waitFor('update');
        component.fruits.unshift('amrud');
        await component.waitFor('update');
        const fruits = clone(component.initialFruits);
        fruits.unshift('amrud');
        checkFruitValue(fruits);
    });

    it('reverse items', async () => {
        component.setInitial();
        await component.waitFor('update');
        component.fruits.reverse();
        await component.waitFor('update');
        const fruits = clone(component.initialFruits);
        fruits.reverse();
        checkFruitValue(fruits);
    });

});


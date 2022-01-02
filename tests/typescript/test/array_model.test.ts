import MahalComponent from "../src/components/array_model";
import { app } from "../src/index";
import { expect } from "chai";

function setValue(el, value) {
    el.value = value;
    el.dispatchEvent(new window.Event("input"));
}

describe('Array Model', function () {

    let component: MahalComponent;

    before(async function () {
        component = await (app as any).mount(MahalComponent);
    });

    it("count table rows", function () {
        expect(component.findAll('div.fruit-row').length).equal(
            component.fruits.length
        );
    });

    it("check tables data", function () {
        const trs = component.findAll('div.fruit-row');
        component.fruits.forEach((fruit, index) => {
            const input = trs[index].querySelector('input');
            expect(input.value).equal(fruit);
            expect(trs[index].querySelector('span').innerText).equal(fruit);
            const btn = trs[index].querySelector('button');
            expect(btn.innerText).equal("Update");
        });
    });

    it("update data", function (done) {
        const newFruits = ["Lemon", "Orange"]
        const clickOnIndex = (index) => {
            const trs = component.findAll('div.fruit-row');
            let btn = trs[index].querySelector('button');
            const input = trs[index].querySelector('input');
            const newValue = newFruits[index];
            setValue(input, newValue);
            btn.click();
            component.waitFor("update").then(_ => {
                const span = component.findAll('div.fruit-row')[index].querySelector('span');
                expect(component.fruits[index]).equal(
                    newValue
                );
                expect(span.innerText).equal(newValue);
                if (++index < newFruits.length) {
                    clickOnIndex(index);
                }
                else {
                    done();
                }
            });
        };
        clickOnIndex(0)
    });
});


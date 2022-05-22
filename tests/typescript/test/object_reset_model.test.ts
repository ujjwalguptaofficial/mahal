import MahalComponent from "../src/components/object_reset_model";
import { app } from "../src/index";
import { expect } from "chai";

function setValue(el, value) {
    el.value = value;
    el.dispatchEvent(new window.Event("input"));
}

describe('Object reset Model', function () {

    let component: MahalComponent;

    before(async function () {
        component = await (app as any).mount(MahalComponent);
    });

    const setTextAndCheck = (text: string) => {
        const input = component.find('div input') as HTMLInputElement;
        const name = component.find('div .name');
        const student = component.student;
        expect(input.value).equal(student.name);
        setValue(input, text);
        return component.waitFor('update').then(_ => {
            expect(name.innerHTML).equal(text);
            expect(student.name).equal(text);
        });
    }

    it("check text change", function () {
        return setTextAndCheck('hey');
    });

    it("reset button", function () {

        const button = component.find('div button') as HTMLButtonElement;
        const text = '';
        button.click();
        return component.waitFor('update').then(_ => {
            const input = component.find('div input') as HTMLInputElement;
            const name = component.find('div .name');
            const student = component.student;
            expect(student.name).equal(text);
            expect(name.innerHTML).equal(text);
            expect(input.value).equal(text);
        });
    });

    it("check text change after reset", function () {
        return setTextAndCheck('hello');
    });

    it("creating gender", () => {
        component.student = {
            name: "ujjwal gupta",
            gender: "male"
        } as any;
        return component.waitFor('update').then(_ => {
            const input = component.find('div input') as HTMLInputElement;
            const name = component.find('div .name');
            const gender = component.find('div .gender');
            const student = component.student;
            expect(input.value).equal(student.name);
            expect(name.innerHTML).equal(student.name);
            expect(gender.innerHTML).equal((student as any).gender);
        });

    })

});


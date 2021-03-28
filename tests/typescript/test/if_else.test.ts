import IfElseComponent from "../src/components/if_else";
import { app } from "../src/index";
import { nextTick } from "mahal";
import { expect } from "chai";
import { createSandbox } from "sinon";

describe('IfELSE', function () {

    let component;

    before(async function () {
        component = await (app as any).mount(IfElseComponent);
    });

    it("check initial state", function () {
        const div = component.findAll('div');
        expect(div).length(1);
        expect(div[0].classList).length(0);
        expect(div[0].innerHTML).equal('undefined');
    });

    it("set state to 0", async function () {
        let sandbox = createSandbox();
        const stub = sandbox.stub(component, "updated");

        component.state = 0;
        await component.waitFor("update");

        const div = component.find('div');
        expect(div.innerHTML).equal('0th0');
        expect(component.element.classList).length(1);
        expect(component.element.className).equal('state-0');
        expect(component.element.getAttribute('stateattr')).equal('0');
        expect(div.classList).length(2);
        expect(div.className).equal('state--0 state--01');

        sandbox.assert.calledOnce(stub);
        sandbox.restore();
    });

    it("set state to 1", async function () {
        component.state = 1;
        await component.waitFor("update");
        const div = component.find('div');
        expect(div.innerHTML).equal('1st1');
        expect(component.element.classList).length(1);
        expect(component.element.className).equal('state-1');
    });

    it("set state to 2", async function () {
        component.state = 2;
        await component.waitFor("update");
        const div = component.find('div');
        expect(div.innerHTML).equal('$2');
    });

    it("set state to 3", async function () {
        component.state = 3;
        await component.waitFor("update");
        const div = component.find('button.btn');
        expect(div.innerHTML).equal('OK');
    });

    it("set state to 5", async function () {
        component.state = 5;
        await component.waitFor("update");
        const div = component.find('button.btn');
        expect(div.innerHTML).equal('HELLO');
    });

    it("set another state to 2", async function () {
        component.anotherState = 2;
        await component.waitFor("update");
        const div = component.find('div');
        expect(div.innerHTML).equal('5');
    });

    it("set state to 10", async function () {
        component.state = 10;
        await component.waitFor("update");
        const div = component.find('button.btn');
        expect(div.innerHTML).equal('10');
    });

    it("set nested value to 0", async function () {
        component.set(component.nested.nested1.nested2, 'nested3', 0);
        await component.waitFor("update");
        expect(component.nested.nested1.nested2.nested3).equal(0);
        const div = component.find('div');
        expect(div.innerHTML).equal('10');
        expect(component.element.classList).length(1);
        expect(component.element.className).equal('nested-3');
        component.set(component.nested.nested1.nested2, 'nested3', null);
        await component.waitFor("update");
        expect(component.element.className).equal('');
    });

    it("set state to 20", function (done) {
        component.state = 20;
        component.waitFor("update").then(() => {
            const div = component.find('div');
            expect(div.innerHTML).equal('20');
            expect(component.element.classList).length(1);
            expect(component.element.className).equal('state-gt-10');
            done();
        })
    });

});


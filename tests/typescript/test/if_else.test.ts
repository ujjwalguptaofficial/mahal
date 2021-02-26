import IfElseComponent from "../src/components/if_else";
import { app } from "../src/index";
import { nextTick } from "mahal";
import { expect } from "chai";

describe('IfELSE', function () {

    let component;

    before(function () {
        component = (app as any).initiate(IfElseComponent);
    });

    it("check initial state", function () {
        const div = component.findAll('div');
        expect(div).length(1);
        expect(div[0].classList).length(0);
        expect(div[0].innerHTML).equal('undefined');
    });

    it("set state to 0", function (done) {
        component.state = 0;
        nextTick(() => {
            const div = component.find('div');
            expect(div.innerHTML).equal('0th0');
            expect(component.element.classList).length(1);
            expect(component.element.className).equal('state-0');
            expect(component.element.getAttribute('stateattr')).equal('0');
            expect(div.classList).length(2);
            expect(div.className).equal('state--0 state--01');
            done();
        })
    });

    it("set state to 1", function (done) {
        component.state = 1;
        nextTick(() => {
            const div = component.find('div');
            expect(div.innerHTML).equal('1st1');
            expect(component.element.classList).length(1);
            expect(component.element.className).equal('state-1');
            done();
        })
    });

    it("set state to 2", function (done) {
        component.state = 2;
        nextTick(() => {
            const div = component.find('div');
            expect(div.innerHTML).equal('$2');
            done();
        })
    });

    it("set state to 3", function (done) {
        component.state = 3;
        nextTick(() => {
            const div = component.find('button.btn');
            expect(div.innerHTML).equal('OK');
            done();
        })
    });

    it("set state to 5", function (done) {
        component.state = 5;
        nextTick(() => {
            const div = component.find('button.btn');
            expect(div.innerHTML).equal('HELLO');
            done();
        })
    });

    it("set another state to 2", function (done) {
        component.anotherState = 2;
        nextTick(() => {
            const div = component.find('div');
            expect(div.innerHTML).equal('5');
            done();
        })
    });

    it("set state to 10", function (done) {
        component.state = 10;
        nextTick(() => {
            const div = component.find('button.btn');
            expect(div.innerHTML).equal('10');
            done();
        })
    });

    it("set nested value to 0", function (done) {
        component.set(component.nested.nested1.nested2, 'nested3', 0);
        nextTick(() => {
            expect(component.nested.nested1.nested2.nested3).equal(0);
            const div = component.find('div');
            expect(div.innerHTML).equal('10');
            expect(component.element.classList).length(1);
            expect(component.element.className).equal('nested-3');
            component.set(component.nested.nested1.nested2, 'nested3', null);
            nextTick(() => {
                expect(component.element.className).equal('');
                done();
            })

        })
    });

    it("set state to 20", function (done) {
        component.state = 20;
        nextTick(() => {
            const div = component.find('div');
            expect(div.innerHTML).equal('20');
            expect(component.element.classList).length(1);
            expect(component.element.className).equal('state-gt-10');
            done();
        })
    });

});


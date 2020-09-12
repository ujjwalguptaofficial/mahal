import IfElseComponent from "../src/components/if_else";
import { app } from "../src/index";
import { nextTick } from "taj";
import { expect } from "chai";

describe('IfELSE', function () {

    let component;

    before(function () {
        component = (app as any).initiate(IfElseComponent);
    });

    it("check initial state", function () {
        const div = component.findAll('div');
        expect(div).length(1);
        expect(div[0].innerHTML).equal('undefined');
    });

    it("set state to 0", function (done) {
        component.state = 0;
        nextTick(() => {
            const div = component.find('div');
            expect(div.innerHTML).equal('0th0');
            done();
        })
    });

    it("set state to 1", function (done) {
        component.state = 1;
        nextTick(() => {
            const div = component.find('div');
            expect(div.innerHTML).equal('1st1');
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

    it("set state to 10", function (done) {
        component.state = 10;
        nextTick(() => {
            const div = component.find('div');
            expect(div.innerHTML).equal('10');
            done();
        })
    });

});


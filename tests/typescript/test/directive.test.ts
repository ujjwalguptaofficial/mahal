import DirectiveComponent from "../src/components/directive";
import { app } from "../src/index";
import { expect } from "chai";
import { nextTick } from "process";

describe('Directive', function () {

    let component;

    before(async function () {
        component = await (app as any).initiate(DirectiveComponent);
    });

    it("check data-name on el1", function () {
        expect(component.find("#el1").getAttribute('data-name')).equal('ujjwal');
    });

    it("check data-name on el2", function (done) {
        const el2 = component.find("#el2");
        expect(el2.getAttribute('data-name')).equal('hello');
        component.name = "world";
        nextTick(() => {
            expect(el2.getAttribute('data-name')).equal('hello');
            done();
        })
    });

    it("check data-name on el3", function () {
        const el3 = component.find("#el3");
        expect(el3.getAttribute('data-name')).equal('taj');
    });

    it("check data-name on el4", function () {
        const el4 = component.find("#el4");
        expect(el4.style.backgroundColor).equal('yellow');
        expect(el4.style.color).equal('black');
    });

    it("check data-name on el5", function () {
        const el4 = component.find("#el5");
        expect(el4.style.backgroundColor).equal('grey');
        expect(el4.style.color).equal('black');
    });

    it("check data-name on el6", function () {
        const el4 = component.find("#el6");
        expect(el4.style.backgroundColor).equal('blue');
        expect(el4.style.color).equal('red');
    });

    it("check data-name on el7", function (done) {
        const el7 = component.find("#el7");
        expect(el7.style.backgroundColor).equal(component.backgroundColor);
        expect(el7.style.color).equal('yellow');
        component.backgroundColor = "maroon";
        setTimeout(() => {
            expect(el7.style.backgroundColor).equal(component.backgroundColor);
            component.el7 = false;
            setTimeout(() => {
                expect(component.isDirectiveDestoyedCalled).equal(true);
                done();
            }, 10);
        }, 10)
    });

    it("check data-name on el8", function (done) {
        const el7 = component.find("#el8");
        expect(el7.style.backgroundColor).equal(component.backgroundColor);
        expect(el7.style.color).equal(component.color);
        component.backgroundColor = "black";
        component.color = "white";
        setTimeout(() => {
            expect(el7.style.backgroundColor).equal(component.backgroundColor);
            expect(el7.style.color).equal(component.color);
            done();
        }, 10)
    });

});


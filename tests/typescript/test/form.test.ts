import FormComponent from "../src/components/form";
import { app } from "../src/index";
import { nextTick } from "taj";
import { expect } from "chai";
import { createSandbox } from "sinon";

describe('MODEL', function () {

    let component;

    before(function () {
        component = (app as any).initiate(FormComponent);
    });

    it("set email value from comp", function (done) {
        component.email = "hi there";
        nextTick(() => {
            expect(component.find('input').value).equal("");
            done();
        })
    })

    it("set textbox to invalid email", function (done) {
        const input = component.find('input');
        input.setValue("random");
        component.find("#btnSubmit").click();
        setTimeout(() => {
            expect(component.isValid).equal(false);
            done();
        }, 10)
    });

    it("set textbox to valid email", function (done) {
        const input = component.find('input');
        input.setValue("random@gmail.com");
        component.find("#btnSubmit").click();
        setTimeout(() => {
            expect(component.isValid).equal(true);
            done();
        }, 10);
    });

});


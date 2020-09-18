import ModelComponent from "../src/components/component_model";
import { app } from "../src/index";
import { nextTick } from "taj";
import { expect } from "chai";

describe('Component MODEL', function () {

    let component;

    before(function () {
        component = (app as any).initiate(ModelComponent);
    });

    it("from component to element", function (done) {
        const input = component.find('input');
        expect(input.value).equal('initial');
        component.text = "ujjwal";
        nextTick(() => {
            expect(input.value).equal('ujjwal');
            done();
        })
    });

    it("from element to component", function () {
        const input = component.find('input');
        input.setValue("random");
        expect(component.text).equal('random');
    });

    it("from component to element once again", function (done) {
        const input = component.find('input');
        component.text = "value changed";
        nextTick(() => {
            expect(input.value).equal('value changed');
            done();
        })
    });

});

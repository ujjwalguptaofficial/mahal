import ArrayComponent from "../src/components/array";
import { app } from "../src/index";
import { nextTick } from "taj";
import { expect } from "chai";
import { createSandbox } from "sinon";

describe('Array', function () {

    let component;

    before(function () {
        component = (app as any).initiate(ArrayComponent);
    });

    it("check list", function () {
        expect(component.findAll(".tr-list")).length(0);
    });

    it("add students using push", function (done) {
        component.students.push({
            name: 'ujjwal'
        })
        nextTick(() => {
            expect(component.findAll(".tr-list")).length(1);
            done();
        })
    });

    it("reset students value", function (done) {
        component.students = [];
        nextTick(() => {
            expect(component.findAll(".tr-list")).length(0);
            done();
        })
    });

});


import ArrayComponent from "../src/components/array";
import { app } from "../src/index";
import { nextTick } from "mahal";
import { expect } from "chai";

describe('Array', function () {

    let component;

    before(async function () {
        component = await (app as any).initiate(ArrayComponent);
    });

    it("check list", function () {
        expect(component.findAll(".tr-list")).length(0);
    });

    it("add students using push", async function () {
        component.students.push({
            name: 'ujjwal'
        })
        await component.waitFor("update");
        expect(component.findAll(".tr-list")).length(1);
    });

    it("set students value directly", function (done) {
        component.students = [
            {
                name: 'ujjwal'
            },
            {
                name: 'ujjwal'
            }
        ];
        component.waitFor("update").then(() => {
            expect(component.findAll(".tr-list")).length(2);
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

    it("add students using btn", function (done) {
        expect(component.students).length(0);
        const newName = "ujjwal gupta";
        component.find('#name').setValue(newName);
        expect(component.name).equal(newName);
        component.find("#btnAdd").click();
        component.waitFor("update").then(() => {
            expect(component.students).length(1);
            expect(component.students[0].name).equal(newName);
            expect(component.find("#name").value).equal('');
            console.log("html", component.element);
            expect(component.findAll(".tr-list")).length(1);
            done();
        })
    });

    it("edit student", function (done) {
        expect(component.students).length(1);
        component.find('#btnEditStudent').click();
        component.waitFor("update").then(() => {
            component.find('.edit-student-input input').setValue("hello");
            component.find('#btnUpdateStudent').click();
        }).then(() => {
            expect(component.students[0].name).equal('hello');
            done();
        })
    });

    it("delete student", function (done) {
        expect(component.students).length(1);
        component.find('.btn-delete').click();
        component.waitFor("update").then(() => {
            expect(component.students).length(0);
            expect(component.findAll(".tr-list")).length(0);
            done();
        })
    });

});


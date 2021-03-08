import ArrayComponent from "../src/components/array";
import { app } from "../src/index";
import { nextTick } from "mahal";
import { expect } from "chai";

describe('Array', function () {

    let component;

    before(async function () {
        component = await (app as any).initiate(ArrayComponent);
    });

    it("check list", function (done) {
        setTimeout(() => {
            expect(component.findAll(".tr-list")).length(0);
            done();
        }, 100);
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

    it("set students value directly", function (done) {
        component.students = [
            {
                name: 'ujjwal'
            },
            {
                name: 'ujjwal'
            }
        ];
        nextTick(() => {
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
        nextTick(() => {
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
        nextTick(() => {
            component.find('.edit-student-input input').setValue("hello");
            component.find('#btnUpdateStudent').click();
        })
        nextTick(() => {
            expect(component.students[0].name).equal('hello');
            done();
        })
    });

    it("delete student", function (done) {
        expect(component.students).length(1);
        component.find('.btn-delete').click();
        nextTick(() => {
            expect(component.students).length(0);
            expect(component.findAll(".tr-list")).length(0);
            done();
        })
    });

});


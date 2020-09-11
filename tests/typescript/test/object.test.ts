import ObjectComponent from "../src/components/object";
import { app } from "../src/index";
import { nextTick, getObjectLength } from "taj";
import { expect } from "chai";
import { createSandbox } from "sinon";

describe('Object', function () {

    let component;

    before(function () {
        component = (app as any).initiate(ObjectComponent);
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

    it("set students value directly", function (done) {
        component.students = {
            'ujjwal': {
                name: 'ujjwal'
            },
            'ujjwal2': {
                name: 'ujjwal'
            }
        };
        nextTick(() => {
            expect(component.findAll(".tr-list")).length(2);
            done();
        })
    });

    it("reset students value", function (done) {
        component.students = {};
        nextTick(() => {
            expect(component.findAll(".tr-list")).length(0);
            done();
        })
    });

    it("add students using btn", function (done) {
        expect(getObjectLength(component.students)).equal(0);
        const newName = "ujjwal gupta";
        component.find('#name').setValue(newName);
        expect(component.name).equal(newName);
        component.find("#btnAdd").click();
        console.log("students", component.students);
        expect(getObjectLength(component.students)).equal(1);
        expect(component.students[newName].name).equal(newName);
        nextTick(() => {
            expect(component.find("#name").value).equal('');
            expect(component.findAll(".tr-list")).length(1);
            done();
        })
    });

    it("edit student", function (done) {
        expect(getObjectLength(component.students)).equal(1);
        component.find('#btnEditStudent').click();
        nextTick(() => {
            component.find('.edit-student-input input').setValue("hello");
            component.find('#btnUpdateStudent').click();
        })
        nextTick(() => {
            expect(component.students['ujjwal gupta'].name).equal('hello');
            done();
        })
    });

    // it("delete student", function (done) {
    //     expect(component.students).length(1);
    //     component.find('.btn-delete').click();
    //     nextTick(() => {
    //         expect(component.students).length(0);
    //         expect(component.findAll(".tr-list")).length(0);
    //         done();
    //     })
    // });

});


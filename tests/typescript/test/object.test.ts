import ObjectComponent from "../src/components/object";
import { app } from "../src/index";
import { nextTick, getObjectLength } from "mahal";
import { expect } from "chai";

describe('Object', function () {

    let component;

    before(async function () {
        component = await (app as any).initiate(ObjectComponent);
    });

    it("check list", function () {
        expect(component.findAll(".tr-list")).length(0);
    });

    it("add students using push", function (done) {
        component.students.push({
            name: 'ujjwal'
        })
        component.waitFor("update").then(() => {
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
        component.waitFor('update').then(() => {
            expect(component.findAll(".tr-list")).length(2);
            done();
        })
    });

    it("reset students value", function (done) {
        component.students = {};
        (nextTick as any)().then(() => {
            expect(component.findAll(".tr-list")).length(0);
            expect(getObjectLength(component.students)).equal(0);
            done();
        })
    });

    it("add students using btn", function (done) {

        const newName = "ujjwal gupta";
        component.find('#name').setValue(newName);
        expect(component.name).equal(newName);
        component.find("#btnAdd").click();
        expect(getObjectLength(component.students)).equal(1);
        expect(component.students[newName].name).equal(newName);
        component.waitFor('update').then(() => {
            expect(component.find("#name").value).equal('');
            expect(component.findAll(".tr-list")).length(1);
            expect(getObjectLength(component.students)).equal(1);
            done();
        })
    });

    it("edit student", function (done) {

        component.find('#btnEditStudent').click();
        component.waitFor('update').then(() => {
            component.find('.edit-student-input input').setValue("hello");
            component.find('#btnUpdateStudent').click();
        }).then(() => {
            expect(component.students['ujjwal gupta'].name).equal('hello');
            done();
        })
    });

    it("add value directly", function (done) {
        component.set(component.students, "john", {
            name: "john"
        })
        component.waitFor("update").then(() => {
            expect(component.findAll(".tr-list")).length(2);
            done();
        })
    });

    it("delete student", function (done) {
        expect(getObjectLength(component.students)).equal(2);
        component.find('.btn-delete').click();
        component.waitFor("update").then(() => {
            expect(getObjectLength(component.students)).equal(1);
            const rows = component.findAll(".tr-list");
            expect(rows).length(1);
            expect(rows[0].querySelector('td').innerText).equal("john")
            done();
        })
    });

    it("add value directly", function (done) {
        component.set(component.students, "batman", {
            name: "batman"
        })
        component.waitFor("update").then(() => {
            expect(getObjectLength(component.students)).equal(2);
            const rows = component.findAll(".tr-list");
            expect(rows).length(2);
            expect(rows[0].querySelector('td').innerText).equal("john")
            expect(rows[1].querySelector('td').innerText).equal("batman")
            done();
        })
    });

    it("add same value", function (done) {
        component.set(component.students, "batman", {
            name: "batman"
        })
        component.waitFor("update").then(() => {
            expect(getObjectLength(component.students)).equal(2);
            const rows = component.findAll(".tr-list");
            expect(rows).length(2);
            expect(rows[0].querySelector('td').innerText).equal("john")
            expect(rows[1].querySelector('td').innerText).equal("batman")
            done();
        })
    });

});


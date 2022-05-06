import ObjectComponent from "../src/components/object";
import { app } from "../src/index";
import { nextTick, getObjectLength } from "mahal";
import { expect } from "chai";
import { setInputValue } from "mahal-test-utils";

describe('Object', function () {

    let component: ObjectComponent;

    before(async function () {
        component = await (app as any).initiate(ObjectComponent);
    });

    it("check list", function () {
        expect(component.findAll(".tr-list")).length(0);
    });

    it("add one students without overwriting var", function (done) {
        component.students['ujjwal'] = {
            name: 'ujjwal'
        };
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
            const trs = component.findAll('tr');
            const lastTr = trs[trs.length - 1];
            const itemLength = lastTr.querySelector('.item-length');
            expect(itemLength.textContent).equal('2');
            done();
        })
    });

    it("reset students value", function (done) {
        component.students = {};
        component.waitFor('update').then(() => {
            expect(component.findAll(".tr-list")).length(0);
            expect(getObjectLength(component.students)).equal(0);
            done();
        })
    });

    it("add students using btn", function (done) {
        const newName = "ujjwal gupta";
        setInputValue(
            component.find('#name'),
            newName
        );
        expect(component.name).equal(newName);
        component.find("#btnAdd").click();

        component.waitFor('update').then(() => {
            expect(getObjectLength(component.students)).equal(1);
            expect(component.students[newName].name).equal(newName);
            expect((component.find("#name") as HTMLInputElement).value).equal('');
            expect(component.findAll(".tr-list")).length(1);
            expect(getObjectLength(component.students)).equal(1);
            done();
        })
    });

    it("edit student", function (done) {

        component.find('#btnEditStudent').click();
        component.waitFor('update').then(() => {
            setInputValue(
                component.find('.edit-student-input input'),
                "hello"
            );
            component.find('#btnUpdateStudent').click();
        }).then(() => {
            expect(component.students['ujjwal gupta'].name).equal('hello');
            done();
        })
    });

    it("add value directly", function (done) {
        component.students["john"] = {
            name: "john"
        };
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
        component.students["batman"] = {
            name: "batman"
        };
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
        component.students["batman"] = {
            name: "batman"
        };
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


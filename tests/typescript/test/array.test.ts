import ArrayComponent from "../src/components/array";
import { app } from "../src/index";
import { Component, nextTick } from "mahal";
import { expect } from "chai";
import { setInputValue } from "@mahaljs/test-utils";

describe('Array', function () {

    let component: ArrayComponent;

    before(async function () {
        component = await (app as any).initiate(ArrayComponent);
        // await component.waitFor("create").then(() => {
        //     expect(component.global.authorName).to.equal("ujjwal");
        // })
    });

    const checkForData = () => {
        const rows = component.findAll(".tr-list");
        expect(rows).length(2);
        component.students.forEach((student, index) => {
            const tds = rows[index].querySelectorAll('td')
            expect(tds[0].innerText).equal(index.toString())
            expect(tds[1].innerText).equal(student.name);
        })
    }

    it("check global value", function () {
        expect((component).global.authorName).to.equal("ujjwal");
    })

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

    it("set students value directly", async function () {
        component.students = [
            {
                name: 'ujjwal'
            },
            {
                name: 'ujjwal'
            }
        ];
        await component.waitFor("update");
        expect(component.findAll(".tr-list")).length(2);
        // debugger;
        // component.students[0].name = 'commander';
        // await component.waitFor("update");
        const trs = component.findAll('tr');
        const lastTr = trs[trs.length - 1] as HTMLTableRowElement;
        const itemLength = lastTr.querySelector('.item-length');
        expect(component.findAll('tr.tr-list.gt-0')).length(1);
        expect(itemLength.textContent).equal('2');
        checkForData();
    });

    it("reset students value", function (done) {
        component.students = [];
        component.waitFor('update').then(() => {
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
            expect(component.findAll(".tr-list")).length(1);
            done();
        })
    });

    it("edit student", function (done) {
        expect(component.students).length(1);
        component.find('#btnEditStudent').click();
        component.waitFor("update").then(() => {
            setInputValue(
                component.find('.edit-student-input input'),
                "hello"
            );
            component.find('#btnUpdateStudent').click();
        }).then(() => {
            expect(component.students[0].name).equal('hello');
            done();
        })
    });

    it("push value directly", function (done) {
        component.students.push(
            {
                name: 'ujjwal'
            }
        );
        component.waitFor("update").then(() => {
            expect(component.findAll(".tr-list")).length(2);
            done();
        })
    });


    it("delete student", function (done) {
        expect(component.students).length(2);
        component.find('.btn-delete').click();
        component.waitFor("update").then(() => {
            expect(component.students).length(1);
            const rows = component.findAll(".tr-list");
            expect(rows).length(1);
            expect(rows[0].querySelector('td').innerText).equal("0")
            done();
        })
    });

    it("push value", function (done) {
        component.students.push(
            {
                name: 'ujjwal'
            }
        );
        component.waitFor("update").then(() => {
            expect(component.findAll(".tr-list")).length(2);
            const rows = component.findAll(".tr-list");
            expect(rows).length(2);
            expect(rows[0].querySelector('td').innerText).equal("0")
            expect(rows[1].querySelector('td').innerText).equal("1")
            done();
        })
    });

});


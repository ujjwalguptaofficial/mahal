import FragmentComponent from "../src/components/fragment";
import { app } from "../src/index";
import { expect } from "chai";
import { setInputValue } from "mahal-test-utils";



describe('Fragment', function () {

    let component: FragmentComponent;

    before(async function () {
        component = await (app as any).mount(FragmentComponent);
    });

    it("count table rows", function () {
        expect(component.findAll('tr').length).equal(2);
    });

    it("check tables data", function () {
        const trs = component.findAll('tr');
        component.students.forEach((student, index) => {
            const tds = trs[index].querySelectorAll('td');
            expect(tds[0].innerText).equal(student.id.toString());
            const btn = tds[2].querySelector('button');
            if (student.isEdit) {
                const input = tds[1].querySelector('input');
                expect(input.value).equal(student.name);
                expect(btn.innerText).equal("Update");
            }
            else {
                expect(tds[1].innerText).equal(student.name);
                expect(btn.innerText).equal("Edit");
            }
        });
    });

    it("update data", function (done) {
        const trs = component.findAll('tr');
        component.students.every((student, index) => {
            let tds = trs[index].querySelectorAll('td');
            expect(tds[0].innerText).equal(student.id.toString());
            let btn = tds[2].querySelector('button');
            if (student.isEdit) {
                const input = tds[1].querySelector('input');
                expect(input.value).equal(student.name);
                expect(btn.innerText).equal("Update");
                const text = 'hello';
                setInputValue(input, text);
                btn.click();
                component.waitFor("update").then(_ => {
                    const td = component.findAll('tr')[index].querySelectorAll('td')[2];
                    btn = td.querySelector('button');
                    expect(btn.innerText).equal("Edit");
                    expect(student.name).equal(text);
                    expect(component.students[index].name).equal(text);
                    done();
                });
                return false;
            }
            return true;
        });
    });

    it("edit data", function (done) {
        const trs = component.findAll('tr');
        const students = component.students;
        students.every((student, index) => {
            let tds = trs[index].querySelectorAll('td');
            expect(tds[0].innerText).equal(student.id.toString());
            let btn = tds[2].querySelector('button');
            if (!student.isEdit) {
                expect(btn.innerText).equal("Edit");
                btn.click();
                const text = 'hello';
                component.waitFor("update").then(_ => {
                    const td = component.findAll('tr')[index].querySelectorAll('td')[2];
                    btn = td.querySelector('button');
                    expect(btn.innerText).equal("Update");
                }).then(_ => {
                    const input = component.findAll('tr')[index].querySelectorAll('td')[1].querySelector('input');
                    expect(input.value).equal(student.name);
                    setInputValue(input, text);
                    btn.click();
                    return component.waitFor("update")
                }).then(_ => {
                    const td = component.findAll('tr')[index].querySelectorAll('td')[2];
                    btn = td.querySelector('button');
                    expect(btn.innerText).equal("Edit");
                    expect(students[index].name).equal(text);
                    done();
                });
                return false;
            }
            return true;
        });
    });
});


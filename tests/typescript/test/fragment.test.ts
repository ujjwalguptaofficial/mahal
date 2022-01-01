import FragmentComponent from "../src/components/fragment";
import { app } from "../src/index";
import { nextTick, clone } from "mahal";
import { expect } from "chai";

describe('MODEL', function () {

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
});


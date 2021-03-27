import Computed from "../src/components/computed";
import { app } from "../src/index";
import { expect } from "chai";
import { nextTick } from "mahal";

describe('Computed', function () {

    let component;

    before(async function () {
        component = await (app as any).initiate(Computed);
    });

    it("check for render", function (done) {
        nextTick(() => {
            expect(component.el.innerHTML).to.equal('ujjwal gupta');
            done();
        });
    });

    it("change first name", function (done) {
        component.firstName = "dev";
        nextTick(() => {
            const div = component.el;
            expect(div.innerHTML).to.equal('dev gupta');
            done();
        });
    });

    it("change last name", function (done) {
        component.lastName = "batista";
        setTimeout(() => {
            const div = component.el;
            expect(div.innerHTML).to.equal('dev batista');
            done();
        }, 10);
    });

});


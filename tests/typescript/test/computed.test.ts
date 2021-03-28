import Computed from "../src/components/computed";
import { app } from "../src/index";
import { expect } from "chai";
import { nextTick } from "mahal";

describe('Computed', function () {

    let component;

    before(async function () {
        component = await (app as any).mount(Computed);
    });

    it("check for render", function () {
        expect(component.el.innerHTML).to.equal('ujjwal gupta');
    });

    it("change first name", async function () {
        component.firstName = "dev";
        await component.waitFor("update");
        const div = component.el;
        expect(div.innerHTML).to.equal('dev gupta');

    });

    it("change last name", async function () {
        component.lastName = "batista";
        await component.waitFor("update");
        const div = component.el;
        expect(div.innerHTML).to.equal('dev batista');
    });

});


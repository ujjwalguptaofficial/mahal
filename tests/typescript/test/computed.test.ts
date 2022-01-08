import Computed from "../src/components/computed";
import { app } from "../src/index";
import { expect } from "chai";
import { nextTick } from "mahal";

describe('Computed', function () {

    let component;

    before(async function () {
        component = await (app as any).mount(Computed);
        expect(component.fullName).equal('ujjwal gupta');
    });

    it("check for render", function () {
        expect(component.el.innerHTML).to.equal('ujjwal gupta');
    });

    it("change first name", async function () {
        component.firstName = "dev";
        await component.waitFor("update");
        const div = component.el;
        expect(div.innerHTML).to.equal('dev gupta');
        expect(component.fullName).equal('dev gupta');

    });

    it("change last name", async function () {
        component.lastName = "batista";
        await component.waitFor("update");
        const div = component.el;
        expect(div.innerHTML).to.equal('dev batista');
        expect(component.fullName).equal('dev batista');
    });


    it("watch computed", function () {
        const oldFullNameValue = component.fullName;
        const promise = new Promise<void>((res, rej) => {
            component.watch("fullName", (newValue, oldValue) => {
                expect(newValue).equal(`dev ${component.lastName}`);
                expect(oldValue).equal(oldFullNameValue);
                res();
            });

            setTimeout(() => {
                rej("watch callback not callback for fullname");
            }, 5000);
        })
        component.lastName = "mysterio";
        return promise;
    });

    it("count  gettter call", () => {
        expect(component.genderDetail).equal("I am male");
        expect(component.genderDetail).equal("I am male");
        expect(component.gendergetCounter).equal(1);
    });

});


import computed from "../src/components/computed";
import { app } from "../src/index";
import { expect } from "chai";

describe('computed', function () {

    let component;

    before(async function () {
        component = await (app as any).mount(computed);
        expect(component.fullName).equal('ujjwal gupta');
    });

    it("check for render using ref", function () {
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
        expect(component.genderDetailCopy).equal("I am male");

        component.gender = "female";
        expect(component.genderDetail).equal("I am female");
        expect(component.genderDetail).equal("I am female");
        expect(component.gendergetCounter).equal(2);

        expect(component.genderDetailCopy).equal("I am female");

    });

    it('set state', () => {
        const promise = new Promise<void>((res) => {
            component.watch('key', (newValue, oldValue) => {
                expect(newValue).equal('new-value');
                expect(component.key).equal('new-value');
                res();
            });
        });
        component.setState('key', 'new-value');
        return promise;
    });

});


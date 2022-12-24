import { app } from "../src/index";
import { nextTick, Component, prop, children, formatter, reactive } from "mahal";
import { expect } from "chai";
import { template } from "@mahaljs/util";


@children({
})
@template(`
<div>
    <div :if(flagOne) class="flag-one">Ujjwal</div>
    <div :if(flagTwo) class="flag-two">Gupta</div>
</div>
`)
class Temp extends Component {

    @reactive
    flagOne = false;

    @reactive
    flagTwo = false;
}

describe('If many', function () {

    let component: Temp;

    it("initiate", async function () {
        component = await (app as any).mount(Temp);
    });

    it("check for initial data", async function () {
        const btn = component.element
        expect(btn.innerText).equal('');

        const flagOneEl = component.find('.flag-one');
        expect(flagOneEl).equal(null);

        const flagTwoEl = component.find('.flag-two');
        expect(flagTwoEl).equal(null);
    });

    it("after making flagone to true", async function () {
        component.flagOne = true;
        await component.waitFor("update");

        const btn = component.element
        expect(btn.innerText).equal('Ujjwal');

        const flagOneEl = component.find('.flag-one');
        expect(flagOneEl.innerText).equal('Ujjwal');

        const flagTwoEl = component.find('.flag-two');
        expect(flagTwoEl).equal(null);

    });

    it("after making flagtwo to true", async function () {
        component.flagTwo = true;
        await component.waitFor("update");

        const flagOneEl = component.find('.flag-one');
        expect(flagOneEl.innerText).equal('Ujjwal');

        const flagTwoEl = component.find('.flag-two');
        expect(flagTwoEl.innerText).equal('Gupta');

    });

    it("after making one to true", async function () {
        component.flagOne = false;
        await component.waitFor("update");

        const btn = component.element
        expect(btn.innerText).equal('Gupta');

        const flagOneEl = component.find('.flag-one');
        expect(flagOneEl).equal(null);

        const flagTwoEl = component.find('.flag-two');
        expect(flagTwoEl.innerText).equal('Gupta');

    });
});


import { app } from "../src/index";
import { nextTick, Component, prop, children, formatter, reactive } from "mahal";
import { expect } from "chai";
import { template } from "@mahaljs/util";


@children({
})
@template(`
<div>
    <div :if(!flagOne) class="flag-one">Ujjwal</div>
</div>
`)
class Temp extends Component {

    @reactive
    flagOne = false;
}

describe('If not', function () {

    let component: Temp;

    it("initiate", async function () {
        component = await (app as any).mount(Temp);
    });

    it("check for initial data", async function () {
        const btn = component.element
        expect(btn.innerText).equal('Ujjwal');

        const flagOneEl = component.find('.flag-one');
        expect(flagOneEl.innerText).equal('Ujjwal');
    });

    it("after making flagone to true", async function () {
        component.flagOne = true;
        await component.waitFor("update");

        const btn = component.element
        expect(btn.innerText).equal('');

        const flagOneEl = component.find('.flag-one');
        expect(flagOneEl).equal(null);

    });
});


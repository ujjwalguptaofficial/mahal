import { app } from "../src/index";
import { nextTick, Component, prop, children, formatter, reactive } from "mahal";
import { expect } from "chai";
import { template } from "@mahaljs/util";


@children({
})
@template(`
<div>
    <div :if(!state)>0</div>
    <div :else-if(state!==0)>1</div>
</div>
`)
class Temp extends Component {

    @reactive
    state = 0;
}

describe('If With Not', function () {

    let component: Temp;

    it("initiate", async function () {
        component = await (app as any).mount(Temp);
    });

    it("check for initial data", async function () {
        const btn = component.find('div');
        expect(btn.innerHTML).equal('0');
    });

    it("after making state to 1", async function () {
        component.state = 1;
        await component.waitFor("update");
        const btn = component.find('div');
        expect(btn.innerHTML).equal('1');
    });
});


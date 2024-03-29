import { app } from "../src/index";
import { nextTick, Component, prop, children } from "mahal";
import { expect } from "chai";
import { spy } from "sinon";
import { template } from "@mahaljs/util";



@children({
    Btn: import('./standard_button')
})
@template(`
<div>
    <Btn class="btn-slot">{{content}}</Btn>
</div>
`)
class Temp extends Component {
    content = "Button"
}

describe('Btn slot child inside test', function () {

    let component;

    it("initiate btn", async function () {
        component = await (app as any).mount(Temp);
        const btn: HTMLButtonElement = component.find('button');
        expect(btn.innerHTML).equal(component.content);
        expect(btn.classList.contains('btn-slot')).equal(true);
    });
});


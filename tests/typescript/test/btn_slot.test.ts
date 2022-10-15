import { app } from "../src/index";
import { nextTick, Component, prop, children, reactive } from "mahal";
import { expect } from "chai";
import { spy } from "sinon";
import { template } from "@mahaljs/util";



@children({
    Btn: import('./standard_button')
})
@template(`
<div>
    <Btn class="btn-slot" :class({active:isActive})>{{content}}</Btn>
</div>
`)
class Temp extends Component {
    content = "Button"

    @reactive
    isActive = false;
}

describe('Btn slot test', function () {

    let component;

    it("initiate btn", async function () {
        const consoleSpy = spy(console, "log");

        component = await (app as any).mount(Temp);
        const btn: HTMLButtonElement = component.find('button');
        expect(btn.innerHTML).equal(component.content);
        expect(btn.classList.contains('btn-slot')).equal(true);

        // check for consoles

        expect(consoleSpy.args).length(3);

        const args0 = consoleSpy.args[0];
        expect(args0).length(1);
        expect(args0[0]).to.equal("mounted");

        const args1 = consoleSpy.args[1];
        expect(args1).length(2);
        expect(args1[0]).to.equal("slot not found in mounted");
        expect(args1[1]).to.equal(true);

        const args2 = consoleSpy.args[2];
        expect(args2).length(2);
        expect(args2[0]).to.equal("class found in mounted");
        expect(args2[1]).to.equal(true);

        consoleSpy.restore();
    });

    it('check for class expression', async () => {
        const btn: HTMLButtonElement = component.find('.btn-slot');
        expect(btn.classList.contains('active')).equal(false);

        component.isActive = true;

        await component.waitFor('update');
        expect(btn.classList.contains('active')).equal(true);

    })
});


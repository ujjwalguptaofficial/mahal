import { app } from "../src/index";
import { nextTick, Template, Component, Prop, Children } from "mahal";
import { expect } from "chai";
import { spy } from "sinon";

@Template(`
    <button>
        <slot></slot>
    </button>
`)
class Btn extends Component {

}

@Children({
    Btn
})
@Template(`
<div>
    <Btn>{{content}}</Btn>
</div>
`)
class Temp extends Component {
    content = "Button"
}

describe('Btn slot test', function () {

    let component;

    it("initiate btn", async function () {
        component = await (app as any).initiate(Temp);
        await nextTick();
        const btn = component.find('button');
        expect(btn.innerHTML).equal(component.content);
    });
});


import { app } from "../src/index";
import { nextTick, Template, Component, Prop, Children } from "mahal";
import { expect } from "chai";
import { spy } from "sinon";



@Children({
    Btn: import('./standard_button')
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
        component = await (app as any).mount(Temp);
        const btn = component.find('button');
        expect(btn.innerHTML).equal(component.content);
    });
});


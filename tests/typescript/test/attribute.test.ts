import { app } from "../src/index";
import { nextTick, Template, Component, Prop, Children, Formatter, Reactive } from "mahal";
import { expect } from "chai";


@Children({
})
@Template(`
<div>
    <div class="name" :name ="content | toUpper"></div>
</div>
`)
class Temp extends Component {
    
    @Reactive
    content = "Button"

    @Formatter("toUpper")
    upperCase(value: string) {
        debugger;
        return value.toUpperCase();
    }
}

describe('Attribute test', function () {

    let component: Temp;

    it("initiate btn", async function () {
        component = await (app as any).mount(Temp);
        const btn = component.find('.name');
        expect(btn.getAttribute('name')).equal(component.upperCase(component.content));
    });

    it("change data", async function () {
        component.content = 'ujjwal';
        const btn = component.find('.name');
        expect(btn.getAttribute('name')).equal(component.upperCase(component.content));
    });
});


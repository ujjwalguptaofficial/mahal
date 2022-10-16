import { app } from "../src/index";
import { nextTick, Component, prop, children, formatter, reactive } from "mahal";
import { expect } from "chai";
import { template } from "@mahaljs/util";


@children({
})
@template(`
<div>
    <div class="name" :name ="content | toUpper"></div>
</div>
`)
class Temp extends Component {

    @reactive
    content = "Button"

    @formatter("toUpper")
    upperCase(value: string) {
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
        await component.waitFor('update');
        const btn = component.find('.name');
        expect(btn.getAttribute('name')).equal(component.upperCase(component.content));
    });
});


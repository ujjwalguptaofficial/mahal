import { app } from "../src/index";
import { nextTick, Component, prop, children, formatter, reactive } from "mahal";
import { expect } from "chai";
import { template } from "@mahaljs/util";


@children({
})
@template(`
<div>
    <div class="name" :name ="content | toUpper" :disabled="isDisabled"></div>
</div>
`)
class Temp extends Component {

    @reactive
    content = "Button"

    @reactive
    isDisabled = false;

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

    it('check for disabled', async () => {
        const el = component.find('.name');
        expect(el.hasAttribute('disabled')).equal(false);

        component.isDisabled = true;

        await component.waitFor('update');
        expect(el.hasAttribute('disabled')).equal(true);
        expect(el.getAttribute('disabled')).equal('true');

    })
});


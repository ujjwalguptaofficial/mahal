import { nextTick, Component, prop, children, reactive } from "mahal";
import { expect } from "chai";
import { template } from "@mahaljs/util";
import { mount } from "@mahaljs/test-utils";
import Btn from './standard_button'


@children({
    Btn: Btn
})
@template(`
    <Btn class="btn-slot"></Btn>
`)
class Temp extends Component {
}

describe('Btn slot default content test', function () {

    let component: Temp;

    it("initiate btn", async function () {
        component = await mount(Temp);
        const el = component.element;
        expect(el.innerText).equal('OK');
    });


});


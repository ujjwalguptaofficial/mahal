import { app } from "../src/index";
import { nextTick, children, reactive, Component, prop } from "mahal";
import { expect } from "chai";
import { template } from "@mahaljs/util";
import { mount } from "@mahaljs/test-utils";

@template(`
    <button class="button">
        <slot></slot>
    </button>
`)
export class StandardButton extends Component {


}

@children({
    StandardButton
})
@template(`
<StandardButton>
    <span class="icon">Icon</span>
    <span class="text">
        <slot></slot>
    </span> 
</StandardButton>
`)
export class Button extends Component {

}

@children({
    Button
})
@template(`
<Button class="is-primary">Verify</Button>
`)
export class Temp extends Component {

}

describe('Multi level slot', function () {

    let component: Temp;

    before(async function () {
        component = await mount(Temp);
    });

    it('check rendering', () => {
        const el = component.element;
        expect(el.className).equal('button is-primary');
        expect(el.innerText).equal('IconVerify')

        // check for child nodes

        expect(el.childNodes).length(2);

        const icon = el.querySelector('.icon');
        expect(icon.innerHTML).equal('Icon');

        const text = el.querySelector('.text');
        expect(text.innerHTML).equal('Verify')
    })
});


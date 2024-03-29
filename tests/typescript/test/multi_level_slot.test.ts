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
    <slot name="loader">Loading...</slot> 
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

@children({
    Button
})
@template(`
<Button class="is-primary">
    <target name="default">Verify</target> 
    <target name="loader">
        <span class="loading">Loading</span>
    </target>
</Button>
`)
export class Temp2 extends Component {

}

@children({
    Button
})
@template(`
<Button class="is-primary">
    <target name="loader">
        <span class="loading">Loading</span>
    </target>
    <target name="default">Verify</target> 
</Button>
`)
export class Temp3 extends Component {

}

@children({
    Button
})
@template(`
<Button class="is-primary">
    <target name="invalid_slot">
        <span class="loading">Loading</span>
    </target>
    <target name="default">Verify</target> 
</Button>
`)
export class Temp4 extends Component {

}

describe('Multi level slot', function () {

    it('check rendering temp', async () => {
        const component = await mount(Temp);
        const el = component.element;
        expect(el.className).equal('button is-primary');
        expect(el.innerText).equal('IconVerifyLoading...')

        // check for child nodes

        expect(el.childNodes).length(3);

        const icon = el.querySelector('.icon');
        expect(icon.innerHTML).equal('Icon');

        const text = el.querySelector('.text');
        expect(text.innerHTML).equal('Verify')

        const loader = el.childNodes[2];
        expect((loader as any).tagName).equal(undefined);
        expect(loader.nodeType).equal(3);
        expect((loader as Text).nodeValue).equal('Loading...')
    })

    it('check rendering temp2', async () => {
        const component = await mount(Temp2);
        const el = component.element;
        expect(el.className).equal('button is-primary');
        expect(el.innerText).equal('IconVerifyLoading')

        // check for child nodes
        expect(el.childNodes).length(3);

        const icon = el.querySelector('.icon');
        expect(icon.innerHTML).equal('Icon');

        const text = el.querySelector('.text');
        expect(text.innerHTML).equal('Verify')

        const loader = el.childNodes[2];
        expect((loader as any).tagName).equal('SPAN');

        expect(loader.innerHTML).equal('Loading');
        expect(loader.className).equal('loading');
    })

    it('check rendering temp3', async () => {
        const component = await mount(Temp3);
        const el = component.element;
        expect(el.className).equal('button is-primary');
        expect(el.innerText).equal('IconVerifyLoading')

        // check for child nodes

        expect(el.childNodes).length(3);

        const icon = el.querySelector('.icon');
        expect(icon.innerHTML).equal('Icon');

        const text = el.querySelector('.text');
        expect(text.innerHTML).equal('Verify')

        const loader = el.childNodes[2];
        expect((loader as any).tagName).equal('SPAN');

        expect(loader.innerHTML).equal('Loading');
        expect(loader.className).equal('loading');
    })


    if (process.env.NODE_ENV !== 'production') {
        it('check rendering temp4', async () => {
            try {
                const component = await mount(Temp4);
                const el = component.element;
                throw "should be error"
            } catch (error) {
                expect(error).equal('{Mahal throw}: No slot found with name \"invalid_slot\". Make sure you are passing right target. Existing slots name are - default,loader\n\ntype : invalid_slot_target')
            }

        });
    }

});


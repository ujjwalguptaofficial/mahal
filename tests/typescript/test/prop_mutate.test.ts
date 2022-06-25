import { app } from "../src/index";
import { nextTick, Children, Template, Reactive, Component, Prop } from "mahal";
import { expect } from "chai";
import { createSandbox, spy } from "sinon";


@Template(`
<div>
Standard Text Area box
   <input type="text" :model(value) />
</div>
`)

export class TextBox extends Component {

    @Prop()
    value;

    constructor() {
        super();
        this.watch("value", this.onInput.bind(this));
    }


    onInput(value) {
        this.emit("input", value);
    }
}

@Children({
    TextArea: TextBox
})
@Template(`
<div>
    <TextArea :model(name)/>
    <div class="name">{{name}}</div>
</div>
`)
class Temp extends Component {
    @Reactive
    name = ""
}

describe('Mutate prop in custom TextBox', function () {

    let component;

    before(async function () {
        component = await (app as any).mount(Temp);
    });

    it("from component to element", async function () {
        const input = component.find('input');
        expect(input.value).equal('');
        const nameDiv = component.find('div.name');
        expect(nameDiv.innerHTML).equal('');
        component.name = "ujjwal";
        await component.waitFor('update');
        expect(nameDiv.innerHTML).to.equal(component.name);
        expect(input.value).equal(component.name);
    });

    it("from element to component", function () {
        const input = component.find('input');
        input.setValue("random");
        expect(component.name).equal('random');
    });

    if (process.env.NODE_ENV !== 'production') {


        it('assert prop check error', function (done) {

            const consoleSpy = spy(console, "error");

            const el = (component.find('input'));
            const value = "jee";
            el.setValue(value);

            nextTick(() => {
                const args = consoleSpy.args[0];
                expect(args).length(2);
                expect(args[0]).to.equal("{Mahal error}:");
                expect(args[1]).to.equal(' Do not mutate prop "value" directly. Instead use a reactive property.\n\nfound in -\n\n<div>Standard Text Area box <input type="text"></div>\n\ntype : mutating_prop');
                expect(component.name).to.equal(value);
                consoleSpy.restore();
                done();
            })
        });
    }
});


import Component from "../src/components/textarea_box";
import { app } from "../src/index";
import { nextTick, Children, Template, Reactive } from "mahal";
import { expect } from "chai";

@Children({
    TextArea: Component
})
@Template(`
<div>
    <TextArea #model(name)/>
    <div class="name">{{name}}</div>
</div>
`)
class Temp extends Component {
    @Reactive
    name = ""
}

describe('MODEL TextAreabox', function () {

    let component;

    before(function () {
        component = (app as any).initiate(Temp);
    });

    it("from component to element", function (done) {
        nextTick(() => {
            const input = component.find('input');
            expect(input.value).equal('');
            const nameDiv = component.find('div.name');
            expect(nameDiv.innerHTML).equal('');
            component.name = "ujjwal";
            nextTick(() => {
                expect(nameDiv.innerHTML).to.equal(component.name);
                expect(input.value).equal(component.name);
                done();
            })
        })

    });

    it("from element to component", function () {
        const input = component.find('input');
        input.setValue("random");
        expect(component.name).equal('random');
    });

});

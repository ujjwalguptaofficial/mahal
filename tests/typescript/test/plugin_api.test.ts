import { app } from "../src/index";
import { nextTick, Children, Template, Reactive, Component, Prop, Plugin, App } from "mahal";
import { expect } from "chai";
class TextPlugin extends Plugin {
    setup() {
        return {
            createDiv: function (text) {
                var div = document.createElement('div');
                div.innerHTML = text;
                div.className = "plugin-text";
                console.log("this", this);
                this.element.appendChild(div);
            }
        }
    }
}

App.extend.plugin(TextPlugin);

@Template(`
<div>
    <div class="name">{{name}}</div>
</div>
`)
class Temp extends Component {
    @Reactive
    name = "ujjwal"
}

describe('Plugin api test', function () {

    let component;

    before(async function () {
        component = await (app as any).initiate(Temp);
    });

    it("add text to dom", function (done) {
        const text = 'i am text inserted by plugin'
        component.$createDiv(text);
        nextTick(() => {
            const nameDiv = component.find('.plugin-text');
            expect(nameDiv.innerHTML).equal(text);
            done();
        })

    });
});


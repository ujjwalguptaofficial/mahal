import { app } from "../src/index";
import { nextTick, Template, Component, Prop, Children, Formatter, Reactive } from "mahal";
import { expect } from "chai";


@Children({
})
@Template(`
<div>
    <button @click={'first' | 'second' | 'third' | 'fourth'}>Click me</button>
</div>
`)
class Temp extends Component {

    first() {
        return new Promise(res => {
            setTimeout(() => {
                res('first')
            }, 200);
        })
    }

    second(result) {
        if (result !== 'first') throw 'first expected'
        return 'second'
    }


    third(result) {
        if (result !== 'second') throw 'second expected'
        return new Promise(res => {
            setTimeout(() => {
                res('third')
            }, 200);
        })
    }

    isFinalCalled = false;

    fourth(result) {
        if (result !== 'third') throw 'third expected'
        this.isFinalCalled = true;
    }
}

describe('Async event test', function () {

    let component: Temp;

    it("initiate btn", async function () {
        component = await (app as any).mount(Temp);
    });

    it("click", async function () {
        const btn = component.find('button');
        btn.click();
        setTimeout(() => {
            expect(component.isFinalCalled).equal(true);
        }, 1000);
    });
});


import { app } from "../src/index";
import { nextTick, Component, prop, children, reactive } from "mahal";
import { expect } from "chai";
import { spy } from "sinon";
import { template } from "@mahaljs/util";
import { mount } from "@mahaljs/test-utils";

let isComp1Destroyed = false;

@template(`
<button>Hello</button>
`)
class Comp1 extends Component {
    content = "Button"

    onInit() {
        this.on('destroy', () => {
            isComp1Destroyed = true;
        })
    }
}

let isComp2Destroyed = false;
@children({
    Comp1: Comp1
})
@template(`
<div>
    <Comp1 />
</div>
`)
class Comp2 extends Component {
    content = "Button"

    onInit() {
        this.on('destroy', () => {
            isComp2Destroyed = true;
        })
    }
}

@children({
    Comp2: Comp2
})
@template(`
<div>
    <Comp2 :if(isActive)/>
</div>
`)
class Temp extends Component {
    content = "Button"

    @reactive
    isActive = true;
}

describe('Child comp destroy', function () {

    let component: Temp;

    it("initiate", async function () {
        component = await mount(Temp);
        const btn: HTMLButtonElement = component.find('button') as any as HTMLButtonElement;
        expect(btn.innerHTML).equal('Hello');
        expect(component['_childComps_'].size).equal(2);
    });

    it('destroy component', async () => {
        expect(isComp1Destroyed).equal(false);
        expect(isComp2Destroyed).equal(false);

        component.isActive = false;
        await component.waitFor('update');
        const btn: HTMLButtonElement = component.find('button') as any as HTMLButtonElement;
        expect(btn).to.be.null;
        expect(isComp2Destroyed).equal(true);
        expect(isComp1Destroyed).equal(true);
        expect(component['_childComps_'].size).equal(1);
    })


});


import { app } from "../src/index";
import { nextTick, Component, prop, children, reactive } from "mahal";
import { expect } from "chai";
import { template } from "@mahaljs/util";

@template(`
    <div :if(cond)>
    </div>
`)
export class Div extends Component {

    cond = false;
}

@template(`
    <in-place :name="name" />
`)
export class InPlace extends Component {

    name;
}


describe('if Initial value false', function () {

    it("initiate Div", async function () {
        const component = await (app as any).mount(Div);

        // should be 8 for  future
        expect(component.element.nodeType).equal(1);
    });

    it("initiate inPlace", async function () {
        const component = await (app as any).mount(InPlace);

        // should be 8 for  future
        expect(component.element.nodeType).equal(8);
        expect(component.find('.temp')).equal(undefined);
    });
});


import { app } from "../src/index";
import { Component, children, reactive } from "mahal";
import { expect } from "chai";
import { template } from "@mahaljs/util";

class BaseClient extends Component {
    @reactive
    state1 = 1;
}

class MoreBaseClient extends BaseClient {
    @reactive
    state2 = 2;
}


@children({
})
@template(`
<div>
    {{state1}}
    {{state2}}
    {{state3}}
    {{state4}}
</div>
`)
class Temp1 extends MoreBaseClient {

    @reactive
    state3 = 3;

    @reactive
    state4 = 4;

}

describe('Declarative reactive test', function () {

    let component: Temp1;

    it("initiate btn", async function () {
        component = await (app as any).mount(Temp1);
    });

    it("check initiated inner html", async function () {
        expect(component.element.innerHTML).equal('1 2 3 4');
    });

    it("change value", async function () {
        component.state1 = 101;
        component.state2 = 102;
        component.state3 = 103;
        component.state4 = 104;
        expect(component.element.innerHTML).equal('101 102 103 104');
    });


});


import { app } from "../src/index";
import { Component, Children, Reactive } from "mahal";
import { expect } from "chai";
import { Template } from "@mahaljs/util";

class BaseClient extends Component {
    @Reactive
    state1 = 1;
}

class MoreBaseClient extends BaseClient {
    @Reactive
    state2 = 2;
}


@Children({
})
@Template(`
<div>
    {{state1}}
    {{state2}}
    {{state3}}
    {{state4}}
</div>
`)
class Temp1 extends MoreBaseClient {

    @Reactive
    state3 = 3;

    @Reactive
    state4 = 4;

}

describe('Declarative reactive test', function () {

    let component: Temp1;

    it("initiate btn", async function () {
        component = await (app as any).mount(Temp1);
    });

    it("check initiated inner html", async function () {
        expect(component.element.innerHTML).equal('1234');
    });

    it("change value", async function () {
        component.state1 = 101;
        component.state2 = 102;
        component.state3 = 103;
        component.state4 = 104;
        expect(component.element.innerHTML).equal('101102103104');
    });


});


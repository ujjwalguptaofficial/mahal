import { app } from "../src/index";
import { nextTick, children, reactive, Component, prop } from "mahal";
import { expect } from "chai";
import { template } from "@mahaljs/util";

@template(`
    <div class="user">
        <div class="name">{{value.name}}</div>
    </div>
`)
class User extends Component {

    @prop()
    value;
}

@children({
    User
})
@template(`
<div>
    <User :value="user" :if(flag)/>
    <div class="flag">{{flag}}</div>
</div>
`)
class Temp extends Component {
    @reactive
    user = {
        name: "ujjwal"
    };

    @reactive
    flag = true;
}

describe('Object prop', function () {

    let component;

    before(async function () {
        component = await (app as any).mount(Temp);
    });

    const testRendering = () => {
        const nameDiv = component.find('.user .name');
        expect(nameDiv.innerHTML).equal(component.user.name);
        const flagDiv = component.find('.flag');
        expect(flagDiv.innerHTML).equal(component.flag.toString());
    }

    it("test for rendering user", function () {
        testRendering();
    });

    it("unmount user and then check", async function () {
        component.flag = false;
        await component.waitFor("update");
        const nameDiv = component.find('.user');
        expect(nameDiv).equal(null);
        const flagDiv = component.find('.flag');
        expect(flagDiv.innerHTML).equal(component.flag.toString());
    });

    it("mount user and then check", async function () {
        component.flag = true;
        await component.waitFor("update");
        testRendering();
    });

});


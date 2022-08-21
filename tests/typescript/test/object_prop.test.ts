import { app } from "../src/index";
import { nextTick, Children, Reactive, Component, Prop } from "mahal";
import { expect } from "chai";
import { Template } from "@mahaljs/util";

@Template(`
    <div class="user">
        <div class="name">{{value.name}}</div>
    </div>
`)
class User extends Component {

    @Prop()
    value;
}

@Children({
    User
})
@Template(`
<div>
    <User :value="user" :if(flag)/>
    <div class="flag">{{flag}}</div>
</div>
`)
class Temp extends Component {
    @Reactive
    user = {
        name: "ujjwal"
    };

    @Reactive
    flag = true;
}

describe('Object Prop', function () {

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


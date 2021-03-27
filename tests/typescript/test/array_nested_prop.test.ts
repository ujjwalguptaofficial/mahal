import { app } from "../src/index";
import { nextTick, Children, Template, Reactive, Component, Prop } from "mahal";
import { expect } from "chai";

@Template(`
    <div class="user">
        <div class="name">{{name}}</div>
    </div>
`)
class User extends Component {

    @Prop()
    value;

    get name() {
        return this.value[0].info.name;
    }
}

@Children({
    User
})
@Template(`
<div>
    <User :value="user" #if(flag)/>
    <div class="flag">{{flag}}</div>
</div>
`)
class Temp extends Component {
    @Reactive
    user = [{
        info: { name: "ujjwal" }
    }];

    @Reactive
    flag = true;
}

describe('Array Nested Object Prop', function () {

    let component;

    before(async function () {
        component = await (app as any).initiate(Temp);
    });

    const testRendering = (done) => {
        setTimeout(() => {
            const nameDiv = component.find('.user .name');
            expect(nameDiv.innerHTML).equal(component.user[0].info.name);
            const flagDiv = component.find('.flag');
            expect(flagDiv.innerHTML).equal(component.flag.toString());
            done();
        }, 50)
    }

    it("test for rendering user", function (done) {
        testRendering(done);
    });

    it("unmount user and then check", async function () {
        component.flag = false;
        await component.waitFor("update");

        const nameDiv = component.find('.user');
        expect(nameDiv).equal(null);
        const flagDiv = component.find('.flag');
        expect(flagDiv.innerHTML).equal(component.flag.toString());
    });

    it("mount user and then check", function (done) {
        component.flag = true;
        testRendering(done);
    });

});


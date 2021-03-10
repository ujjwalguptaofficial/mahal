import { app } from "../src/index";
import { nextTick, Children, Template, Reactive, Component, Prop } from "mahal";
import { expect } from "chai";

@Template(`
    <div class="user">
        <div class="name">{{value.info.name}}</div>
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
    <User :value="user" #if(flag)/>
    <div class="flag">{{flag}}</div>
</div>
`)
class Temp extends Component {
    @Reactive
    user = {
        info: { name: "ujjwal" }
    };

    @Reactive
    flag = true;
}

describe('Nested Object Prop', function () {

    let component;

    before(function () {
        component = (app as any).initiate(Temp);
    });

    const testRendering = (done) => {
        setTimeout(() => {
            const nameDiv = component.find('.user .name');
            expect(nameDiv.innerHTML).equal(component.user.info.name);
            const flagDiv = component.find('.flag');
            expect(flagDiv.innerHTML).equal(component.flag.toString());
            done();
        }, 50)
    }

    it("test for rendering user", function (done) {
        testRendering(done);
    });

    it("unmount user and then check", function (done) {
        component.flag = false;
        nextTick(() => {
            const nameDiv = component.find('.user');
            expect(nameDiv).equal(null);
            const flagDiv = component.find('.flag');
            expect(flagDiv.innerHTML).equal(component.flag.toString());
            done();
        })
    });

    it("mount user and then check", function (done) {
        component.flag = true;
        testRendering(done);
    });

});


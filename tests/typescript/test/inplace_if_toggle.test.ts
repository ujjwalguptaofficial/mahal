import { app } from "../src/index";
import { nextTick, Template, Component, Prop, Children, Reactive } from "mahal";
import { expect } from "chai";
import Btn from "../src/components/btn";

@Children({
    Btn
})
@Template(`
<div>
    <in-place :of="name" #if(flag) label="as"/>
</div>
`)
class Temp extends Component {
    content = "Button"

    @Reactive
    flag = false;

    name = "Btn"
}

describe('InPlace if toggle', function () {

    let component;

    const testNotExist = (done) => {
        const btn = component.find('button.btn');
        expect(btn).to.equal(null);
        done();
    }

    const testExist = (done) => {
        const btn = component.find('.btn');
        expect(btn).to.not.equal(null);
        done();
    }

    it("initiate btn", function (done) {
        component = (app as any).initiate(Temp);
        testNotExist(done);
    });

    for (let i = 0; i < 2; i++) {
        it(`turn on - ${i}`, function (done) {
            component.flag = true;
            setTimeout(() => {
                testExist(done);
            }, 100);
        });
        it(`turn off - ${i}`, function (done) {
            component.flag = false;
            setTimeout(() => {
                testNotExist(done);
            }, 100);
        });
    }
});


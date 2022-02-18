import { app } from "../src/index";
import { nextTick, Template, Component, Prop, Children, lazyComponent, Timer } from "mahal";
import { expect } from "chai";
import { spy } from "sinon";



@Children({
    Btn: lazyComponent(() => Promise.reject('load failed'))
})
@Template(`
<div>
    <Btn>{{content}}</Btn>
</div>
`)
class Temp extends Component {
    content = "Button"

    error: string;
    onInit(): void {
        this.on('error', err => {
            debugger;
            this.error = err;
        })
    }
}

describe('Component load fail', function () {

    let component: Temp;

    it("initiate btn", function (done) {
        component = (app as any).initiate(Temp, {}, (comp) => {
            setTimeout(() => {
                expect(comp.error).equal('load failed');
                done();
            }, 200);
        });
    });
});


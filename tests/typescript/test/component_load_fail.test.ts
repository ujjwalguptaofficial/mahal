import { app } from "../src/index";
import { nextTick, Component, prop, children, lazyComponent } from "mahal";
import { expect } from "chai";
import { spy } from "sinon";
import { template } from "@mahaljs/util";



@children({
    Btn: lazyComponent(() => Promise.reject('load failed'))
})
@template(`
<div>
    <Btn>{{content}}</Btn>
</div>
`)
class Temp extends Component {
    content = "Button"

    error: string;
    appError: string;
    onInit(): void {
        this.on('error', err => {
            this.error = err;
        })
        app.on('error', err => {
            this.appError = err;
        })
    }
}

describe('Component load fail', function () {

    let component: Temp;

    it("initiate btn", function (done) {
        component = (app as any).initiate(Temp, {}, (comp) => {
            setTimeout(() => {
                const expectedError = 'load failed';
                expect(comp.error).equal(expectedError);
                expect(comp.appError).equal(expectedError);
                done();
            }, 200);
        });
    });
});


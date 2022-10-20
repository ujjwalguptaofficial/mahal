import { app } from "../src/index";
import { nextTick, Component, prop, children, lazyComponent } from "mahal";
import { expect } from "chai";
import { spy } from "sinon";
import { template } from "@mahaljs/util";
import { getMount, initiate } from "@mahaljs/test-utils";



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

    it("initiate btn", async function () {
        const initiateWithApp = getMount(app);
        component = await initiateWithApp<Temp>(Temp);
        const expectedError = 'load failed';
        await new Promise((res) => {
            setTimeout(res, 200);
        })
        expect(component.error).equal(expectedError);
        expect(component.appError).equal(expectedError);

        // (app as any).initiate(Temp, {}, (comp) => {
        //     setTimeout(() => {
        //         const expectedError = 'load failed';
        //         debugger;
        //         expect(comp.error).equal(expectedError);
        //         expect(comp.appError).equal(expectedError);
        //         done();
        //     }, 200);
        // });
    });
});


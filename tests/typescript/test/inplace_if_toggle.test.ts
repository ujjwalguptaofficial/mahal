import { app } from "../src/index";
import { lazyComponent, computed, Component, prop, children, reactive } from "mahal";
import { expect } from "chai";
import { template } from "@mahaljs/util";

@children({
    Btn: lazyComponent(() => import('../src/components/btn')),
    HelloWorld: lazyComponent(() => import('../src/components/hello_world'))
})
// @template(`
// <div>
//     <in-place :of="name" #if(flag1 && flag2) label="as"/>
// </div>
// `)
@template(`
<div>
    <in-place :of="componentName" label="as"/>
</div>
`)
export class Temp extends Component {
    content = "Button"

    @reactive
    flag1 = true;

    @reactive
    flag2 = false;

    @reactive
    name = "Btn"

    @computed('name', 'flag1')
    componentName() {
        return this.flag1 ? this.name : null;
    }

    onInit(): void {
        window['compTemp'] = this;
    }
}

describe('InPlace if toggle', function () {

    let component: Temp;

    const testNotExist = () => {
        const btn = component.find('button.btn');
        expect(btn).to.equal(null);
    }

    const testExist = () => {
        const btn = component.find('.btn');
        expect(btn).to.not.equal(null);
        // done();
    }

    it("initiate btn", async function () {
        component = await (app as any).mount(Temp);
        testExist();
    });

    // for (let i = 0; i < 3; i++) {
    //     it(`turn on - ${i}`, function (done) {
    //         setTimeout(async () => {
    //             component.flag1 = true;
    //             component.flag2 = true;
    //             await component.waitFor("update");
    //             testExist(done);
    //         }, 10)
    //     });

    //     it(`turn off - ${i}`, function (done) {
    //         setTimeout(async () => {
    //             component.flag1 = false;
    //             component.flag2 = false;
    //             await component.waitFor("update");
    //             testNotExist();
    //             done();
    //         }, 10)
    //     });
    // }

    it("check watchlist length", function () {
        expect(component['_watchBus_']._events_["name"]).length(1);
        expect(window['error']).to.equal(undefined);
    });

    it('flag1 to false', async () => {
        component.flag1 = false;
        await component.waitFor('update');
        testNotExist();
        component.flag1 = true;
        await component.waitFor('update');
        testExist();
    })

    it('change comp name', async () => {
        component.name = "HelloWorld";
        await component.waitFor('update');
        testNotExist();
        await new Promise(res => {
            setTimeout(res, 100)
        });
        expect(
            (component.element.querySelectorAll('.hello-world'))
        ).length(1);
    })
});


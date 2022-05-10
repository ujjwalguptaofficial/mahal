import { app } from "../src/index";
import { lazyComponent, Template, Component, Prop, Children, Reactive } from "mahal";
import { expect } from "chai";
import HelloWorld from "../src/components/hello_world";

@Children({
    Btn: lazyComponent(() => import('../src/components/btn')),
    HelloWorld: lazyComponent(() => import('../src/components/hello_world'))
})
// @Template(`
// <div>
//     <in-place :of="name" #if(flag1 && flag2) label="as"/>
// </div>
// `)
@Template(`
<div>
    <in-place :if(flag1) :of="name" label="as"/>
</div>
`)
class Temp extends Component {
    content = "Button"

    @Reactive
    flag1 = true;

    @Reactive
    flag2 = false;

    @Reactive
    name = "Btn"
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
        expect(component['__watchBus__']._events["name"]).length(1);
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
        await component.timer.timeout(1000);
        expect(
            (component.element.querySelectorAll('.hello-world'))
        ).length(1);
    })
});


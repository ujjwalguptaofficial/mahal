import { app } from "../src/index";
import { lazyComponent, Component, removeEl, children, reactive } from "mahal";
import { expect } from "chai";
import { template } from "@mahaljs/util";
import { getMount, mount } from "@mahaljs/test-utils";

const els = new Set<Component>();

@children({

})
@template(`
    <div class="comp3">
    Comp3
        <in-place :of="componentName"/>
    </div>
`)
export class Comp3 extends Component {
    componentName = null;
    name = "comp3";

    onInit(): void {
        els.add(this);
        this.on('destroy', () => {
            debugger;
            els.delete(this);
        })
    }
}

@children({
    Comp3
})
@template(`
    <div class="comp2">
        Comp2
        <in-place :of="componentName"/>
    </div>
`)
export class Comp2 extends Component {
    componentName = "Comp3"
    name = "comp2";

    onInit(): void {
        els.add(this);
        this.on('destroy', () => {
            debugger;
            els.delete(this);
        })
    }
}

@children({
    Comp2,
    HelloWorld: lazyComponent(() => import('../src/components/hello_world'))
})
@template(`
    <div class="comp1">
    Comp1
        <in-place  :of="componentName"/>
    </div>
`)
export class Comp1 extends Component {

    @reactive
    componentName = "Comp2";
    name = "comp1";

    @reactive count = 0;

    onInit(): void {
        els.add(this);
        this.on('destroy', () => {
            debugger;
            els.delete(this);
        })
        this['allEls'] = els;
        window['comp1'] = this;
        window['removeEl'] = removeEl;
    }
}

describe('Nested inplace', async function () {

    let component: Comp1;

    before(async function () {
        component = await getMount(app)(Comp1);
    });

    it("check for rendering", function () {
        expect(component.find('.comp3')).not.null;
    });

    it('make component null', async () => {
        component.componentName = null;
        await component.waitFor('update');
        expect(
            (component['allEls'] as Set<any>).size
        ).equal(1);
    })

    it('make component not null', async () => {
        component.componentName = "Comp2";
        await component.waitFor('update');
        expect(
            (component['allEls'] as Set<any>).size
        ).equal(3);
    })


    it('destroy', (done) => {
        component.on('destroy', () => {
            setTimeout(() => {
                expect(
                    (component['allEls'] as Set<any>).size
                ).equal(0);
                done();
            }, 20);
        });
        removeEl(component.element);
    })

});


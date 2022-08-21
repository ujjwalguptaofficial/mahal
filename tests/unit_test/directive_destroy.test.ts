import { expect } from "chai";
import { Component, Directive, Reactive, Computed } from "mahal";
import { initiate, mount } from "mahal-test-utils";
import { Template, Watch } from "@mahaljs/util";

@Template(`
<div class='dd'>
    <div :if(flag)>
        <div>
            <div :dirTest(selected)>Hello World</div>
        </div>
    </div>
</div>
`)
class ArrayComp extends Component {

    @Reactive
    selected = true;

    @Reactive
    flag = true;

    updateCount = 0;

    @Directive()
    dirTest() {
        ++this.updateCount;
        return {
            valueUpdated: () => {
                ++this.updateCount;
            },
        }
    }

    onInit(): void {
        window['tempComp'] = this;
    }

    changeState() {
        this.flag = false;
        this.selected = false;
    }

}


describe("Directive destroy", () => {
    let component: ArrayComp;
    before(async () => {
        component = await mount<ArrayComp>(ArrayComp);
    })

    it("count update test", async () => {
        expect(component.updateCount).equal(1);
    })

    it("set selected to true", async () => {
        component.selected = true;
        await new Promise(res => {
            setTimeout(res, 100)
        });
        expect(component.updateCount).equal(1);
    })

    it('set flag to false', async () => {
        component.flag = false;
        component.selected = false;
        await new Promise(res => {
            setTimeout(res, 100)
        });
        expect(component.updateCount).equal(1);
    })

})
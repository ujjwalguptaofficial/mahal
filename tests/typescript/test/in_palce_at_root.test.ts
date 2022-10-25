import { app } from "../src/index";
import { lazyComponent, computed, Component, prop, children, reactive } from "mahal";
import { expect } from "chai";
import { template } from "@mahaljs/util";
import { getMount, mount } from "@mahaljs/test-utils";

@children({
    UsersHobbie: lazyComponent(() => import('../src/components/users_hobbie')),
    HelloWorld: lazyComponent(() => import('../src/components/hello_world'))
})
@template(`
    <in-place :of="componentName"/>
`)
export class RouterView extends Component {

    @reactive
    componentName = null;

    onInit(): void {
        window['compTemp'] = this;
    }
}

describe('Inplace at root', async function () {

    let component: RouterView;

    before(async function () {
        component = await getMount(app)(RouterView);
    });

    it("check initial to be comment", function () {
        expect(component.element.nodeType).equal(8);
    });

    it("change to hello world", async function () {
        component.componentName = "HelloWorld";
        await component.waitFor('update');
        expect(component.element.nodeType).equal(1);
        expect(component.element.className).equal('hello-world');
    });

    it("change to users hobbie", async function () {
        component.componentName = "UsersHobbie";
        await component.waitFor('update');
        expect(component.element.nodeType).equal(1);
        expect(component.element.className).equal('users');
    });

    it("change to null again", async function () {
        component.componentName = null;
        await component.waitFor('update');
        expect(component.element.nodeType).equal(8);
    });

});


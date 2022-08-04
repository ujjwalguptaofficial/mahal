import HelloWorld from "../src/components/hello_world";
import { app } from "../src/index";
import { nextTick, getObjectLength, Timer } from "mahal";
import { expect } from "chai";
import { createSandbox, spy } from "sinon";

describe('HelloWorld', function () {

    let component;

    before(function () {

    });

    it("initiate component", async function () {
        const consoleSpy = spy(console, "log");

        component = await (app as any).mount(HelloWorld, {
            props: {
                count: 0
            }
        });
        expect(component.isMounted).equal(true);
        expect(consoleSpy.args).length(3);
        const args1 = consoleSpy.args[0];
        expect(args1).length(3);
        expect(args1[0]).to.equal("constructor");
        expect(args1[1]).to.equal(component.name);
        expect(args1[2]).to.equal(undefined);

        const args2 = consoleSpy.args[1];
        expect(args2).length(2);
        expect(args2[0]).to.equal("created");
        expect(args2[1]).to.equal(component.name);

        const args3 = consoleSpy.args[2];
        expect(args3).length(3);
        expect(args3[0]).to.equal("mounted");
        expect(args3[1]).to.equal(component.name);
        expect(args3[2]).to.equal(0);
        consoleSpy.restore();

    });

    it('id=name inner html should equal ujjwal gupta', function () {
        expect(component.find("#name").innerHTML).equal("UJJWAL GUPTA");
    });

    it('check if condition', async function () {
        expect(component.find("#testFilter")).equal(null);
        component.setState('count', 1);
        await component.waitFor("update");
        expect(component.find("#testFilter")).not.equal(null);
    });

    it('check show condition', function (done) {
        const el = component.find("#testFilter");
        expect(el.style.display).equal('none');
        component.flag = true;
        nextTick(() => {
            expect(el.style.display).equal('unset');
            done();
        })
    });

    it('change name', async function () {
        component.name = "hello!";
        await component.waitFor("update");
        expect(component.find("#name").innerHTML).equal("HELLO!");

    });

    it('value of count button', async function () {
        const btn = component.find('#count');
        expect(btn.innerHTML).equal('1');
        const eventId = component.on("click", function () {
            component.setState('count', component.count + 1);
        });
        btn.click();
        await component.waitFor("update");
        expect(component.count).equal(2);
        expect(btn.innerHTML).equal('2');
        component.off("click", eventId);
    });

    it('click count button', async function () {
        let sandbox = createSandbox();
        sandbox.stub(component, "emit");
        component.find('#count').click();
        // await component.waitFor("update");
        sandbox.assert.calledOnceWithExactly(component.emit as any, "click");
        sandbox.restore();
    });

    it('click count button 5 times', async function () {
        component.count = 0;
        const btn = component.find('#count');
        component.on("click", function () {
            component.setState('count', component.count + 1);
        });
        for (let i = 0; i < 5; i++) {
            component.find('#count').click();
        }
        await component.waitFor("update");
        expect(component.count).equal(5);
        expect(btn.innerHTML).equal('5');
    });

    it('inner html', () => {
        expect(component.find('.p-html').innerHTML).equal("<b>BOLD</b>")
    })

    it('change html', async () => {
        component.myHtml = "<i>Italic</i>";
        await component.waitFor('update');
        expect(component.find('.p-html').innerHTML).equal("<i>Italic</i>")
    })

    it('test filter rendering', () => {
        expect(component.count).gt(0);
        expect(component.find('#testFilter').innerHTML).equal("STRING");
        // expect(component.dependency_['"ujjwal" ']).equal(undefined);
        // expect(component.dependency_['"ujjwal"']).equal(undefined);
    })

    it("destroy", function (done) {
        component.on("destroy", () => {
            new Timer().timeout(20).then(_ => {
                expect(component.element).equal(null);
                expect(component.__eventBus__).equal(null);
                expect(component.__ob__).equal(null);
                expect(component.__watchBus__._events).deep.equal({});
                // expect(component.dependency_).equal(null);
                // expect(getObjectLength(component.dependency_)).equal(0);
                // expect(getObjectLength(component.watchList_)).equal(0);
                done();
            })
        });
        component.destroy();
    })

});


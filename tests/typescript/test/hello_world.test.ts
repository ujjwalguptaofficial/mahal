import HelloWorld from "../src/components/hello_world";
import { app } from "../src/index";
import { nextTick, getObjectLength } from "mahal";
import { expect } from "chai";
import { createSandbox, spy } from "sinon";

describe('HelloWorld', function () {

    let component;

    before(function () {

    });

    it("initiate component", async function (done) {
        const consoleSpy = spy(console, "log");

        component = await (app as any).initiate(HelloWorld, {
            props: {
                count: 0
            }
        });
        nextTick(() => {
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
            expect(args3[0]).to.equal("rendered");
            expect(args3[1]).to.equal(component.name);
            expect(args3[2]).to.equal(0);
            consoleSpy.restore();
            done();
        })
    });

    it('id=name inner html should equal ujjwal gupta', function () {
        expect(component.find("#name").innerHTML).equal("UJJWAL GUPTA");
    });

    it('check if condition', function (done) {
        expect(component.find("#testFilter")).equal(null);
        component.count = 1;
        nextTick(() => {
            expect(component.find("#testFilter")).not.equal(null);
            done();
        })
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

    it('change name', function (done) {
        component.name = "hello!";
        nextTick(() => {
            expect(component.find("#name").innerHTML).equal("HELLO!");
            done();
        })
    });

    it('value of count button', function (done) {
        const btn = component.find('#count');
        expect(btn.innerHTML).equal('1');
        component.on("click", function () {
            ++component.count;
        });
        btn.click();
        expect(component.count).equal(2);
        nextTick(() => {
            expect(btn.innerHTML).equal('2');
            done();
        });
        component.off("click");
    });

    it('click count button', function () {
        let sandbox = createSandbox();
        sandbox.stub(component, "emit");
        component.find('#count').click();
        sandbox.assert.calledOnceWithExactly(component.emit as any, "click");
        sandbox.restore();
    });

    it('click count button 5 times', function (done) {
        component.count = 0;
        const btn = component.find('#count');
        component.on("click", function () {
            ++component.count;
        });
        for (let i = 0; i < 5; i++) {
            component.find('#count').click();
        }
        expect(component.count).equal(5);
        nextTick(() => {
            expect(btn.innerHTML).equal('5');
            done();
        })
    });

    it('inner html', () => {
        expect(component.find('.p-html').innerHTML).equal("<b>BOLD</b>")
    })

    it('test filter rendering', () => {
        expect(component.count).gt(0);
        expect(component.find('#testFilter').innerHTML).equal("STRING");
        expect(component.dependency_['"ujjwal" ']).equal(undefined);
        expect(component.dependency_['"ujjwal"']).equal(undefined);
    })

    it("destroy", function (done) {
        component.on("destroyed", () => {
            nextTick(() => {
                expect(component.element).equal(null);
                expect(component.eventBus_).equal(null);
                // expect(component.dependency_).equal(null);
                expect(getObjectLength(component.dependency_)).equal(0);
                expect(component.storeWatchCb_).equal(null);
                expect(component.watchList_).to.be.an('object')
                // expect(getObjectLength(component.watchList_)).equal(0);
                done();
            })
        });
        component.destroy();
    })

});


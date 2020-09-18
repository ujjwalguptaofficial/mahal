import HelloWorld from "../src/components/hello_world";
import { app } from "../src/index";
import { nextTick, getObjectLength } from "taj";
import { expect } from "chai";
import { createSandbox } from "sinon";

describe('HelloWorld', function () {

    let component;

    before(function () {

    });

    it("initiate component", function (done) {
        component = (app as any).initiate(HelloWorld, {
            props: {
                count: 0
            }
        });
        component.on("created", () => {
            component.on("rendered", () => {
                done();
            });
        });
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
        expect(component.find('#testFilter').innerHTML).equal("STRING");
        expect(component.dependency_['"ujjwal" ']).equal(undefined);
        expect(component.dependency_['"ujjwal"']).equal(undefined);
    })

    it("destroy", function (done) {
        component.on("destroyed", () => {
            nextTick(() => {
                expect(component.element).equal(null);
                expect(component.events_).equal(null);
                expect(component.dependency_).equal(null);
                expect(component.storeWatchCb_).equal(null);
                expect(component.watchList_).to.be.an('object')
                // expect(getObjectLength(component.watchList_)).equal(0);
                done();
            })
        });
        component.destroy();
    })

});


import HelloWorld from "../src/components/hello_world";
import { app } from "../src/index";
import { nextTick } from "taj";
import { expect } from "chai";
import { createSandbox } from "sinon";

describe('HelloWorld', function () {

    let component;

    before(function () {

    });

    it("initiate component", function (done) {
        console.log("calling rendered");
        component = (app as any).$initiate(HelloWorld, {
            props: {
                count: 0
            }
        });
        component.on("rendered", () => {
            done();
        });
    });

    it('id=name inner html should equal ujjwal gupta', function () {
        expect(component.find("#name").innerHTML).equal("UJJWAL GUPTA");
    });

    it('value of count button', function (done) {
        const btn = component.find('#count');
        expect(btn.innerHTML).equal('0');
        component.on("click", function () {
            ++component.count;
        });
        btn.click();
        expect(component.count).equal(1);
        nextTick(() => {
            expect(btn.innerHTML).equal('1');
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


});


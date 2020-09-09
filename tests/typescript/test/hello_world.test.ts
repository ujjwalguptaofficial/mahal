import HelloWorld from "../src/components/hello_world";
import { app } from "../src/index";
import { expect } from "chai";
import { createSandbox } from "sinon";
import { nextTick } from "process";

describe('HelloWorld', function () {

    let component;

    before(function () {
        component = (app as any).$initiate(HelloWorld, {
            props: {
                count: 0
            }
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
        console.log("watcher", component.watchList_)
        component.find('#count').click();
        expect(component.count).equal(1);
        setTimeout(() => {
            expect(btn.innerHTML).equal('1');
            done();
        }, 1000)
    });

    it('click count button', function () {
        let sandbox = createSandbox();
        sandbox.stub(component, "emit");
        component.find('#count').click();
        sandbox.assert.calledOnceWithExactly(component.emit as any, "click");
        sandbox.restore();
    });


});


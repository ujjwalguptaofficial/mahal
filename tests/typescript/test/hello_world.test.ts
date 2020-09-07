import HelloWorld from "../src/components/hello_world";
import { app } from "../src/index";
import { expect } from "chai";
import { createSandbox } from "sinon";

describe('HelloWorld', function () {

    let component;

    before(function () {
        component = (app as any).$initiate(HelloWorld);
    });

    it('id=name inner html should equal ujjwal gupta', function () {
        expect(component.find("#name").innerHTML).equal("UJJWAL GUPTA");
    });

    it('click count button', function () {
        let sandbox = createSandbox();
        sandbox.stub(component, "emit");
        component.find('#count').click();
        sandbox.assert.calledOnceWithExactly(component.emit as any, "click");
        sandbox.restore();
    });

    it('value of count button', function () {
        component.count = 0;
        const btn = component.find('#count');
        expect(btn.innerHTML).equal('0');
        component.find('#count').click();
        component.on("click", function () {
            ++component.count;
        });
        expect(btn.innerHTML).equal('1');

    });
});


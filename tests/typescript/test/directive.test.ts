import DirectiveComponent from "../src/components/directive";
import { app } from "../src/index";
import { expect } from "chai";
import { nextTick } from "process";

describe('Directive', function () {

    let component;

    before(function () {
        component = (app as any).initiate(DirectiveComponent);
    });

    it("check data-name on el1", function () {
        expect(component.find("#el1").getAttribute('data-name')).equal('ujjwal');
    });

    it("check data-name on el2", function () {
        const el2 = component.find("#el2");
        expect(el2.getAttribute('data-name')).equal('hello');
        component.name = "world";
        nextTick(()=>{
            expect(el2.getAttribute('data-name')).equal('hello');
        })
    });

});


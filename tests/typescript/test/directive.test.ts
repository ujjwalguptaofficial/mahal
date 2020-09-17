import DirectiveComponent from "../src/components/directive";
import { app } from "../src/index";
import { expect } from "chai";

describe('Directive', function () {

    let component;

    before(function () {
        component = (app as any).initiate(DirectiveComponent);
    });

    it("check data-name", function () {
        expect(component.element.getAttribute('data-name')).equal('ujjwal');
    });

});


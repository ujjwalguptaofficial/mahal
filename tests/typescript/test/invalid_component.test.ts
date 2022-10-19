import InvalidComponent from "../src/components/invalid_component";
import { app } from "../src/index";
import { expect } from "chai";


describe('Invalid Component', function () {


    it("initiate invalid component", function (done) {

        const promise = (app as any).initiate(InvalidComponent);
        if (process.env.NODE_ENV === 'production') {
            promise.then(component => {
                const el: HTMLElement = component.element;
                expect(el.tagName).equal('DIV');
                expect(el.querySelectorAll('IfElse')).length(1);
                done();
            })
        }
        else {
            promise.catch(error => {
                expect(error).equal('{Mahal throw}: Component "IfElse" is not registered. Make sure you have registered component either in parent component or globally.\n\ntype : invalid_component')
                done();
            })
        }
    });
});


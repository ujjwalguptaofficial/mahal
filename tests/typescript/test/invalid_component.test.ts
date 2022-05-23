import InvalidComponent from "../src/components/invalid_component";
import { app } from "../src/index";
import { expect } from "chai";


describe('Invalid Component', function () {

    let component;

    it("initiate invalid component", function (done) {

        (app as any).initiate(InvalidComponent).catch(error => {
            expect(error).equal('{Mahal throw}: Component "IfElse" is not registered. Make sure you have registered component either in parent component or globally.\n\ntype : invalid_component')
            done();
        })
    });
});


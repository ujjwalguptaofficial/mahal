import InvalidComponent from "../src/components/invalid_component";
import { app } from "../src/index";
import { expect } from "chai";


describe('Invalid Component', function () {

    let component;

    it("initiate invalid component", function () {
        try {
            component = (app as any).initiate(InvalidComponent);
        } catch (error) {
            expect(error).equal("{Palace throw}: Component \"IfElse\" is not registered. Make sure you have registered component either in parent component or globally.\n\n        type : invalid_component\n        ")
        }
    });
});


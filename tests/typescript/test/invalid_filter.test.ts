import InvalidFilter from "../src/components/invalid_filter";
import { app } from "../src/index";
import { expect } from "chai";


describe('MODEL', function () {

    let component;

    it("initiate invalid component", function () {
        try {
            component = (app as any).initiate(InvalidFilter);
        } catch (error) {
            expect(error).equal("{Taj throw}: Can not find Filter \"invalid\". Make sure you have registered filter either in component or globally.\n\n        type : invalid_filter\n        ")
        }
    });
});


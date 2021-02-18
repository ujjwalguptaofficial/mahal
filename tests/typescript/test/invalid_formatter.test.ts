import InvalidFilter from "../src/components/invalid_filter";
import { app } from "../src/index";
import { expect } from "chai";


describe('Invalid Formatter', function () {

    let component;

    it("initiate invalid formatter", function () {
        try {
            component = (app as any).initiate(InvalidFilter);
        } catch (error) {
            expect(error).equal("{Taj throw}: Can not find Formatter \"invalid\". Make sure you have registered formatter either in component or globally.\n\n        type : invalid_formatter\n        ")
        }
    });
});


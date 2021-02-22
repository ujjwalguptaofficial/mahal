import Component from "../src/components/invalid_event_handler";
import { app } from "../src/index";
import { expect } from "chai";


describe('Invalid Formatter', function () {

    let component;

    it("initiate invalid formatter", function () {
        try {
            component = (app as any).initiate(Component);
        } catch (error) {
            expect(error.trim()).equal(`{Palace throw}: Invalid event handler for event "click", Handler does not exist in component.\n\n        type : invalid_event_handler\n`.trim())
        }
    });
});


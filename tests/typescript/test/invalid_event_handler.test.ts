import Component from "../src/components/invalid_event_handler";
import { app } from "../src/index";
import { expect } from "chai";


describe('Invalid Event Handler', function () {

    let component;
    if (process.env.NODE_ENV !== 'production') {

        it("initiate event handler", async function () {
            try {
                component = await (app as any).initiate(Component);
            } catch (error) {
                expect(error).equal(`{Mahal throw}: Invalid event handler for event "click", Handler does not exist in component.\n\ntype : invalid_event_handler`);
            }
        });
    }

});


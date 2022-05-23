import InvalidFilter from "../src/components/invalid_filter";
import { app } from "../src/index";
import { expect } from "chai";


describe('Invalid Formatter', function () {

    let component;

    it("initiate invalid formatter", async function () {
        try {
            component = await (app as any).initiate(InvalidFilter);
        } catch (error) {
            expect(error).equal(`{Mahal throw}: Can not find Formatter "invalid". Make sure you have registered formatter either in component or globally.\n\ntype : invalid_formatter`)
        }
    });
});


import Btn from "../src/components/btn";
import { app } from "../src/index";
import { expect } from "chai";
import { spy } from "sinon";

describe('Btn prop test', function () {

    let component;

    it("initiate btn with wrong data type", async function () {
        const consoleSpy = spy(console, "error");
        component = await (app as any).mount(Btn, {
            props: {
                label: false
            }
        });
        const args = consoleSpy.args[0];
        expect(args).length(2);
        expect(args[0]).to.equal("{Mahal error}:");
        expect(args[1]).to.equal(' Expected datatype of property label is string but received boolean.\n\n\n\ntype : prop_data_type_mismatch');
        consoleSpy.restore();
    });


    it("initiate  with right data type", async function () {
        component = await (app as any).mount(Btn, {
            props: {
                label: "ujjwal"
            }
        });
        const data = component.element.textContent.trim();
        expect(data).equal("UJJWAL");
    });

});


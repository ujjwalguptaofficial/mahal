import Btn from "../src/components/btn";
import { app } from "../src/index";
import { nextTick } from "mahal";
import { expect } from "chai";
import { spy } from "sinon";

describe('Btn prop test', function () {

    let component;

    it("initiate btn with wrong data type", function (done) {
        const consoleSpy = spy(console, "error");
        component = (app as any).initiate(Btn, {
            props: {
                label: false
            }
        });
        nextTick(() => {
            const args = consoleSpy.args[0];
            expect(args).length(2);
            expect(args[0]).to.equal("{Palace error}:");
            expect(args[1]).to.equal(' Expected Data type of property label is string but received boolean.\n\n\n\ntype : prop_data_type_mismatch');
            consoleSpy.restore();
            done();
        })
    });


    it("initiate  with right data type", function (done) {
        component = (app as any).initiate(Btn, {
            props: {
                label: "ujjwal"
            }
        });
        nextTick(() => {
            const data = component.element.textContent.trim();
            expect(data).equal("UJJWAL");
            done();
        })
    });

});


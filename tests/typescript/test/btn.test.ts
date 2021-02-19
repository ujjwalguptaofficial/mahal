import Btn from "../src/components/btn";
import { app } from "../src/index";
import { nextTick } from "mahal";
import { expect } from "chai";

describe('Btn prop test', function () {

    let component;

    it("initiate btn with wrong data type", function () {
        try {
            component = (app as any).initiate(Btn, {
                props: {
                    label: false
                }
            });
        } catch (error) {
            expect(error).equal('{Taj throw}: Expected Data type of property label is string but received boolean,in template - \n                    \n<button class="btn" on:click="handleClick">{{label | toUpper}}</button>\n \n                    \n\n        type : prop_data_type_mismatch\n        ');
        }
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


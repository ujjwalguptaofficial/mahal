import ObjectProp from "../src/components/object_prop";
import { app } from "../src/index";
import { expect } from "chai";
import { nextTick } from "mahal";

describe('Object prop', function () {

    let component;

    before(function () {
        component = (app as any).initiate(ObjectProp);
    });

    it("check for rendering", function (done) {
        nextTick(() => {
            const name = component.find('p.name');
            expect(name).to.not.equal(null);
            expect(name.innerHTML).to.equal('ujjwal');

            const gender = component.find('p.gender');
            expect(gender).to.not.equal(null);
            expect(gender.innerHTML).to.equal('male');

            done();
        })

    });

});


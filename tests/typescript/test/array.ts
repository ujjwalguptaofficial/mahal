import ArrayComponent from "../src/components/array";
import { app } from "../src/index";
import { nextTick } from "taj";
import { expect } from "chai";
import { createSandbox } from "sinon";

describe('Array', function () {

    let component;

    before(function () {
        component = (app as any).initiate(ArrayComponent, {
            props: {
                count: 0
            }
        });
    });

    // it("initiate component", function (done) {


    // });

});


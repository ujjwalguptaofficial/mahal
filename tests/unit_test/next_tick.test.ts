import { expect } from "chai";
import { nextTick, Template, Directive, Reactive, Computed } from "mahal";
import { initiate, mount } from "mahal-test-utils";


describe("Next tick", () => {


    it("nextTick", async () => {
        return new Promise((res) => {
            nextTick(_ => {
                nextTick(res);
            })
        })
    })



})
import { expect } from "chai";
import { nextTick} from "mahal";



describe("Next tick", () => {


    it("nextTick", async () => {
        return new Promise((res) => {
            nextTick(_ => {
                nextTick(res);
            })
        })
    })



})
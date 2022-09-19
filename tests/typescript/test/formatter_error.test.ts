import { app } from "../src/index";
import { reactive, Component, formatter } from "mahal";
import { expect } from "chai";
import { mount, getMount } from "@mahaljs/test-utils";
import { template } from "@mahaljs/util";



@template(`
<div>
    <button>{{content | toUpper}}</button>
</div>
`)
class Temp extends Component {
    @reactive
    content = "Button"

    error: string;
    appError: string;
    onInit(): void {
        this.on('error', err => {
            this.error = err.message;
        })
        app.on('error', err => {
            this.appError = err.message;
        })
    }

    @formatter()
    toUpper(value) {
        return value.toUpperCase();
    }
}

describe('formatter run time error', function () {

    let component: Temp;

    it("initiate btn", async function () {
        const appMount = getMount(app);
        component = await appMount(Temp);
        expect(component.element.querySelector('button').innerHTML).equal(
            component.content.toUpperCase()
        )
    });

    it("change button content to undefined", function (done) {
        component.content = null;
        setTimeout(() => {
            const expectedError = 'Cannot read properties of null (reading \'toUpperCase\')';
            expect(component.error).equal(expectedError);
            expect(component.appError).equal(expectedError);
            done();
        }, 200);
    });


});


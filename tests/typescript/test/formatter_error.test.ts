import { app } from "../src/index";
import { Reactive, Component, Formatter } from "mahal";
import { expect } from "chai";
import { mount, getMount } from "@mahaljs/test-utils";
import { Template } from "@mahaljs/util";



@Template(`
<div>
    <button>{{content | toUpper}}</button>
</div>
`)
class Temp extends Component {
    @Reactive
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

    @Formatter()
    toUpper(value) {
        return value.toUpperCase();
    }
}

describe('Formatter run time error', function () {

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


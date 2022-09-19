import { Component, computed, reactive } from "mahal";
import { template } from "@mahaljs/util";

@template(`
    <div :ref(el)>
        {{fullName}}
    </div>
`)
export default class extends Component {

    @reactive
    firstName = "ujjwal";

    @reactive
    lastName = "gupta";

    @computed("firstName", "lastName")
    get fullName() {
        return this.firstName + " " + this.lastName;
    }

    constructor() {
        super();
        this.on("mount", function () {
            console.log("mounted", this);
        })
        window['comp'] = this;
    }

    gendergetCounter = 0;
    @reactive gender = "male";

    @computed("gender")
    get genderDetail() {
        this.gendergetCounter++;
        return `I am ${this.gender}`;
    }

    @computed("gender")
    genderDetailCopy() {
        return `I am ${this.gender}`;
    }



}

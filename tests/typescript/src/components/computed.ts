import { Component, Template, Computed, Reactive } from "mahal";
@Template(`
    <div #ref(el)>
        {{fullName}}
    </div>
`)
export default class extends Component {

    @Reactive
    firstName = "ujjwal";

    @Reactive
    lastName = "gupta";

    @Computed("firstName", "lastName")
    get fullName() {
        return this.firstName + " " + this.lastName;
    }

    constructor() {
        super();
        window['comp'] = this;
    }

    gendergetCounter = 0;

    gender = "male";

    @Computed("gender")
    get genderDetail() {
        this.gendergetCounter++;
        return `I am ${this.gender}`;
    }

}

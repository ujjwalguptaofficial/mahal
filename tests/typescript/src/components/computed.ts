import { Component, Template, Computed, Reactive } from "mahal";
@Template(`
    <div :ref(el)>
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
        this.on("mount",function(){
            console.log("mounted", this);
        })
        window['comp'] = this;
    }

    gendergetCounter = 0;
    @Reactive gender = "male";

    @Computed("gender")
    get genderDetail() {
        this.gendergetCounter++;
        return `I am ${this.gender}`;
    }

    @Computed("gender")
    genderDetailCopy() {
        return `I am ${this.gender}`;
    }



}

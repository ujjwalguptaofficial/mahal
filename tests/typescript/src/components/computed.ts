import { Component, Template, Computed, Reactive } from "mahal";



@Template(`
    <div>
        {{fullName}}
    </div>
`)
export default class Main extends Component {

    @Reactive
    firstName = "ujjwal";

    @Reactive
    lastName = "gupta";

    @Computed("firstName", "lastName")
    get fullName() {
        return this.firstName + " " + this.lastName;
    }
}

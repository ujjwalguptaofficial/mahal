import { Component, Template, Prop, Formatter, Reactive } from "mahal";

@Template(`<div>
<input :model(email) type="text" />
<button id="btnSubmit" on:click={"validate" | "submit"}>Submit</button>
</div>
`)

export default class extends Component {

    email = "";

    validate() {
        console.log("vaidate called");
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email);
    }

    isValid;

    submit(isValid) {
        this.isValid = isValid;
        console.log("isValid", isValid, this.email);
    }

}
import { Component, reactive } from "mahal";
import { template } from "@mahaljs/util";

@template(`
<div>
   <input class="text" type="text" :model(text) />
   <textarea class="textarea" type="textarea" :model(textareaValue) />
   <input class="checkbox" type="checkbox" :model(checkboxValue) />


   <input class="radio one" type="radio" :model(radioButtonValue) name="gender" value="male" />
   Male
   <input class="radio two" type="radio" :model(radioButtonValue) name="gender" value="female" />
    Female

    <br/><br/>
    <label for="cars">Choose a car:</label>

    <select :model(selectValue) class="dropdown">
      <option value="volvo">Volvo</option>
      <option value="saab">Saab</option>
      <option value="mercedes">Mercedes</option>
      <option value="audi">Audi</option>
    </select>

    <br/><br/>
</div>
`)

export default class extends Component {

    @reactive
    text;

    @reactive
    textareaValue;

    @reactive
    checkboxValue;

    @reactive
    radioButtonValue = "male";

    @reactive
    selectValue = "audi";

    onInit() {
        window['modelComp'] = this;
    }

}
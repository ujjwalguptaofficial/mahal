import { Component, Template, Reactive, clone } from "mahal";


@Template(`
<div>
<p #for(fruit,index in fruits)>
 {{index}}-{{fruit}}
</p>
</div>
`)
export default class extends Component {

    @Reactive
    fruits = [];

    initialFruits = ["Banana", "Orange", "Apple", "Mango"];

    constructor() {
        super();
        window['fruitsComp'] = this;
        this.setInitial();
    }

    setInitial() {
        this.fruits = clone(this.initialFruits);
    }
}


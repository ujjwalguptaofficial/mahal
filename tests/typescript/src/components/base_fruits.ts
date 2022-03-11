import { Component, Template, Reactive, clone } from "mahal";


@Template(`
<div>
<p :for(fruit,index in fruits)>
 {{index}}-{{fruit}}
</p>
</div>
`)
export default class extends Component {

    fruits;

    get initialFruits() {
        return ["Banana", "Orange", "Apple", "Mango"];
    }

    onInit() {
        window['fruitsComp'] = this;
        this.setInitial();
        this.on("update", () => {
            console.log('updated');
        });
    }

    setInitial() {
        const newFruits = clone(this.initialFruits);
        if (this.isReactive) {
            this.fruits = newFruits;
        }
        else {
            this.setState('fruits', newFruits);
        }
    }

    isReactive = true;
}


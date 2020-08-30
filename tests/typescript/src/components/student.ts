import { Component, Template, Prop, Taj, Filter, Reactive } from "taj";


@Template(`
<div>
    <table>
      <tr #for(student,index in students)>
       <td>{{student.name}}</td>
       <td on:click="editStudent()"><button>EditStudent</button></td>
      </tr>
    </table>
 
</div>
`)
export default class extends Component {

    constructor() {
        super();
        this.onRendered(() => {
            console.log("store", this.$store);
        })
    }

    // @Getter("students")
    // students

    @Reactive
    students = [{
        name: 'ujjwa'
    }]

    @Reactive
    flag = true;

    addStudent() {
        this.students.push({
            name: 'ujjwal1'
        })
    }

    // addStudent() {
    //     this.$store.commit("addStudent", {
    //         name: 'ujjwal1'
    //     })
    // }

    changeName() {
        this.changeNameInStore("ujjwal kr gupta");
    }

    @Mutation("changeName")
    changeNameInStore;

    @Getter("name")
    name;
}


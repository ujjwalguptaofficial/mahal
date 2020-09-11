import { Component, Template, Reactive } from "taj";


@Template(`
<div>
<button on:click="reset">Reset</button>
    <table>
    <tr>
        <td><input id="name" #model(name) ></input></td>
        <td id="btnAdd"><button on:click="addStudent">Add Student</button></td>
    </tr>
    <tr class="tr-list" #for(student,index in students)>
    <td>{{index}}</td>
    <td #if(student.isEdit) >as{{student | toS}}<input #model(editName) ></input></td>
    <td #else >{{student.name}}</td>
    <td #if(student.isEdit) on:click="()=>{updateStudent(index)}"><button>UpdateStudent</button></td>
    <td #else on:click="()=>{editStudent(index)}"><button>EditStudent</button></td>
    </tr>
    </table>
</div>
`)
export default class extends Component {

    @Reactive
    students = []

    @Reactive
    name = "";

    @Reactive
    editName = "";


    addStudent() {
        this.students.push({
            name: this.name
        });
        this.name = "";
    }

    editStudent(index) {
        this.editName = this.students[index].name;
        this.set(this.students, index, {
            ... this.students[index], ...{
                isEdit: true
            }
        })
    }

    updateStudent(index) {
        this.students[index].name = this.editName;
        this.set(this.students, index, {
            ... this.students[index], ...{
                isEdit: false
            }
        })
    }

    reset() {
        this.students = [];
    }

}


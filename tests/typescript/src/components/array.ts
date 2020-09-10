import { Component, Template, Reactive } from "taj";


@Template(`
<div>
    <table>
    <tr>
        <td><input #model(name) ></input></td>
        <td on:click="addStudent"><button>Add Student</button></td>
    </tr>
      <tr #for(student,index in students)>
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

    @Reactive
    name = "";

    @Reactive
    editName = "";
}


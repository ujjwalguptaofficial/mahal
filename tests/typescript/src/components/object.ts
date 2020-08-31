import { Component, Template, Prop, Taj, Filter, Reactive } from "taj";


@Template(`
<div>
    <table>
    <tr>
        <td><input #model(name) ></input></td>
        <td on:click="addStudent"><button>Add Student</button></td>
    </tr>
      <tr #for(student,key in students)>
       <td>{{key}}</td>
       <td #if(student.isEdit) >as{{student | toS}}<input #model(editName) ></input></td>
       <td #else >{{student.name}}</td>
       <td #if(student.isEdit) on:click="()=>{updateStudent(key)}"><button>UpdateStudent</button></td>
       <td #else on:click="()=>{editStudent(key)}"><button>EditStudent</button></td>
      </tr>
    </table>
 
</div>
`)
export default class extends Component {

    @Reactive
    students: any = {
        'ujjwal': {
            name: 'ujjwal'
        }
    }


    addStudent() {
        // this.students[this.name] = {
        //     name: this.name
        // };
        this.$set(this.students, this.name, {
            name: this.name
        })
        this.name = "";
    }

    editStudent(index) {
        this.editName = this.students[index].name;
        this.$set(this.students, index, {
            ... this.students[index], ...{
                isEdit: true
            }
        })
    }

    updateStudent(index) {
        this.students[index].name = this.editName;
        this.$set(this.students, index, {
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


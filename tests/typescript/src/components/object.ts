import { Component, Template, Reactive, LIFECYCLE_EVENT } from "mahal";


@Template(`
<div>
<button on:click="reset">Reset</button>

    <table>
    <tr>
        <td><input id="name" #model(name) ></input></td>
        <td id="btnAdd" on:click="addStudent"><button>Add Student</button></td>
    </tr>
      <tr class="tr-list" #for(student,key in students)>
       <td>{{key}}</td>
       <td class="edit-student-input" #if(student.isEdit) >
            <input #model(editName) ></input>
       </td>
       <td #else >{{student.name}}</td>
       <td #if(student.isEdit) on:click="()=>{updateStudent(key)}"><button id="btnUpdateStudent">UpdateStudent</button></td>
       <td #else on:click="()=>{editStudent(key)}"><button id="btnEditStudent">EditStudent</button></td>
        <td><button class="btn-delete" on:click="()=>{deleteStudent(key)}">Delete</button></td>
      
       </tr>
    </table>
 
</div>
`)
export default class extends Component {

    @Reactive
    students: any = {

    }

    @Reactive
    name = "";

    @Reactive
    editName = "";


    addStudent() {
        // this.students[this.name] = {
        //     name: this.name
        // };
        this.setAndReact(this.students, this.name, {
            name: this.name
        })
        this.name = "";
    }

    editStudent(index) {
        this.editName = this.students[index].name;
        this.setAndReact(this.students, index, {
            ... this.students[index], ...{
                isEdit: true
            }
        })
    }

    updateStudent(index) {
        this.students[index].name = this.editName;
        this.setAndReact(this.students, index, {
            ... this.students[index],
            ...{
                isEdit: false
            }
        })
    }

    deleteStudent(key) {
        this.deleteAndReact(this.students, key);
    }

    reset() {
        this.students = {
            'ujjwal': {
                name: 'ujjwal'
            },
            'ujjwal2': {
                name: 'ujjwal'
            }
        };
    }

    constructor() {
        super();
        window['comp'] = this;
        this.on(LIFECYCLE_EVENT.Update, () => {
            console.log("updated");
        })
    }
}


import { Component, reactive, computed } from "mahal";
import { template } from "@mahaljs/util";
import { IAppGlobal } from "../interfaces";


@template(`
<div>
<button on:click="()=>{reset()}">Reset</button>
    <table>
    <tr>
        <td><input id="name" :model(name) /></td>
        <td><button id="btnAdd" on:click="addStudent">Add Student</button></td>
        <td></td>
    </tr>
    <tr class="tr-list" :for(student,index in students) :class="{'gt-0':index>0}">
    <td>{{index}}</td>
    <td class="edit-student-input" :if(student.isEdit) >
       <input :model(editName) />
    </td>
    <td :else >{{student.name}}</td>
    <td :if(student.isEdit) on:click="()=>{updateStudent(index)}"><button id="btnUpdateStudent">UpdateStudent</button></td>
    <td :else on:click="()=>{editStudent(index)}"><button id="btnEditStudent">EditStudent</button></td>
    <td><button class="btn-delete" on:click="()=>{deleteStudent(index)}">Delete</button></td>
    </tr>

    <tr>
    <td class="item-length">{{studentsLength}}</td>
    <td>Hello</td>
</tr>
    </table>
</div>
`)
export default class extends Component<IAppGlobal> {

    @reactive
    students = []

    @reactive
    name = "";

    @reactive
    editName = "";

    @computed('students')
    get studentsLength() {
        return this.students.length;
    }


    addStudent() {
        this.students.push({
            name: this.name
        });
        this.name = "";
    }

    editStudent(index) {
        this.editName = this.students[index].name;
        this.students[index] = {
            ... this.students[index], ...{
                isEdit: true
            }
        };
        // this.setAndReact(this.students, index, {
        //     ... this.students[index], ...{
        //         isEdit: true
        //     }
        // })
    }

    updateStudent(index) {
        this.students[index].name = this.editName;
        this.students[index] = {
            ... this.students[index], ...{
                isEdit: false
            }
        };
        // this.setAndReact(this.students, index, {
        //     ... this.students[index], ...{
        //         isEdit: false
        //     }
        // })
    }

    reset() {
        this.students = [{
            name: 'ujjwal'
        },
        {
            name: 'ujjwal'
        }];
    }

    deleteStudent(index) {
        this.students.splice(index, 1);
    }

    onInit() {
        window["arrayComp"] = this;
    }

}


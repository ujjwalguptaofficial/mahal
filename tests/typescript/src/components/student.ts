import { Component, Template, Prop, Taj, Filter, Reactive } from "taj";


// @Template(`
// <div>
//     <table>
//     <tr>
//         <td><input #model(name) ></td>
//         <td on:click="addStudent"><button>Add Student</button></td>
//     </tr>
//       <tr #for(student,index in students)>
//        <td>{{index}}</td>
//        <td #if(!student.isEdit)>{{student.name}}</td>
//        <td #else><input #model(editName) ></td>
//        <td  #if(!student.isEdit) on:click="()=>{editStudent(index)}"><button>EditStudent</button></td>
//        <td  #else on:click="()=>{updateStudent(index)}"><button>UpdateStudent</button></td>
//       </tr>
//     </table>
 
// </div>
// `)
@Template(`<div #if(!s.s=false1)>
{{ name }}
<button on:click="changeName">ChangeName</button>
<button on:click="()=>{flag=false}">Hide Name</button>
<table>
  <tr #for(student in students)>
   <td>{{student.name}}</td>
   <td on:click="addStudent"><button>AddStudent</button></td>
  </tr>
</table
</div>`)
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
        this.students[index].isEdit = true;
    }

    updateStudent(index) {
        this.students[index].name = this.editName;
        this.students[index].isEdit = false;

    }

    @Reactive
    name = "";

    @Reactive
    editName = "";
}


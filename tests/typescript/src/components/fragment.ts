import { Component, Template, Prop, Formatter, Reactive } from "mahal";

// @Template(`<div>
// <fragment #for(student in students)>
// {{student.name}}
// </fragment>
// </div>
// `)
@Template(`<div>
    <table>
        <fragment #for(student in students)>
            <tr #if(student.isEdit)>
                <td>{{student.id}}</td>
                <td>
                    <input type="text" #model(student.name)/>
                </td>
                <td>
                    <button on:click="()=>{ updateStudent(student) }">Update</button>
                </td>
            </tr>
            <tr #else>
                <td>{{student.id}}</td>
                <td>{{student.name}}</td>
                <td>
                     <button on:click="()=>{ edit(student) }">Edit</button>
                </td>
            </tr>
        </fragment>
    </table>
</div>
`)

export default class extends Component {

    @Reactive
    students = [
        {
            name: 'ujjwal',
            id: 1
        },
        {
            name: 'commander',
            isEdit: true,
            id: 2
        }
    ]

    updateStudent(student) {
        console.log('student', student);
        const index = this.students.findIndex(q => q.id === student.id);
        const savedStudent = this.students[index];
        savedStudent.isEdit = false;
        this.set(this.students, index, savedStudent);
    }

    edit(student) {
        const index = this.students.findIndex(q => q.id === student.id);
        const savedStudent = this.students[index];
        savedStudent.isEdit = true;
        this.set(this.students, index, savedStudent);
    }

}
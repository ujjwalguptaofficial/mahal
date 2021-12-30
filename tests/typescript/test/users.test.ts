import UsersComponent from "../src/components/users";
import { app } from "../src/index";
import { expect } from "chai";

describe('User slot test', function () {

    let component;

    before(async function () {
        component = await (app as any).initiate(UsersComponent, {
            props: {
                users: [{
                    name: "Ujjwal kumar",
                    gender: "Male"
                }]
            }
        });
    });

    it("check users length", function () {
        expect(component.findAll(".users")).length(1);
        expect(component.findAll(".user-comp")).length(2);
    });


    it("check user rendered", function (done) {
        const firstUser = component.find('.users');
        expect(firstUser.querySelector('.name').textContent.trim()).equal("My name is Ujjwal kumar.");
        expect(firstUser.querySelector('.gender').textContent.trim()).equal("I am Male.");
        done();
    });

    it("check user rendered in reactive", function (done) {
        const firstUser = component.find('.reactive-users');
        expect(firstUser.querySelector('.name').textContent.trim()).equal("My name is Ujjwal.");
        expect(firstUser.querySelector('.gender').textContent.trim()).equal("I am Male.");
        done();
    });

    it("reset reactive users ", function (done) {
        component.reactiveUsers = [{
            name: "prince",
            gender: "male"
        }]
        component.waitFor('update').then(() => {
            const firstUser = component.find('.reactive-users');
            expect(firstUser.querySelector('.name').textContent.trim()).equal("My name is prince.");
            expect(firstUser.querySelector('.gender').textContent.trim()).equal("I am male.");
            done();
        })
    });

    it("check reactive users length after adding more user", function (done) {
        component.reactiveUsers.push({
            name: "prince",
            gender: "male"
        })
        component.updated().then(() => {
            expect(component.findAll(".reactive-users")).length(2);
            done();
        })
    });

});


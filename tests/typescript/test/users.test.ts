import UsersComponent from "../src/components/users";
import { app } from "../src/index";
import { nextTick } from "taj";
import { expect } from "chai";

describe('User slot test', function () {

    let component;

    before(function () {
        component = (app as any).initiate(UsersComponent, {
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
    });


    it("check user rendered", function (done) {
        const firstUser = component.find('.users');
        expect(firstUser.querySelector('.name').textContent.trim()).equal("My name is Ujjwal kumar.");
        expect(firstUser.querySelector('.gender').textContent.trim()).equal("I am Male.");
        done();
    });

});


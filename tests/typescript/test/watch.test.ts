import { app } from "../src/index";
import { nextTick, children, reactive, Component } from "mahal";
import { expect } from "chai";
import { template } from "@mahaljs/util";


@template(`
<div>
     
</div>
`)
class Temp extends Component {

    @reactive
    name = ""

    @reactive
    users = []

}

describe('watch', function () {

    let component: Temp;

    before(async function () {
        component = await (app as any).mount(Temp);
    });

    it("check reactive of primitive property - name", function (done) {
        let newName = "ujjwal";
        let prop = "name";
        const eventId = component.watch(prop, (newVal, oldVal) => {
            expect(newVal).equal(newName);
            expect(oldVal).equal("");
            component.unwatch(prop, eventId);
            expect(component['_watchBus_']._events_[prop]).length(0);
            done();
        });
        expect(component['_watchBus_']._events_[prop]).length(1);
        component.name = newName;
    });

    it("check reactive of array property - users", function (done) {
        let newVal = [{ name: 'ujjwal' }];
        let prop = "users";
        const eventId = component.watch(prop, (newValue, oldVal) => {
            expect(newVal).equal(newValue);
            expect(oldVal).length(0);
            component.unwatch(prop, eventId);
            expect(component['_watchBus_']._events_[prop]).length(0);
            done();
        });
        expect(component['_watchBus_']._events_[prop]).length(1);
        component[prop] = newVal;
    });

    it("check push of array property - users", function (done) {
        let valueToAdd = { name: 'ujjwal gupta' };
        let prop = "users.push";
        const eventId = component.watch(prop, (newValue, oldVal) => {
            expect(newValue).eql([valueToAdd]);
            expect(oldVal).equal(undefined);
            component.unwatch(prop, eventId);
            expect(component['_watchBus_']._events_[prop]).length(0);
            expect(component.users).length(2);
            done();
        });
        expect(component['_watchBus_']._events_[prop]).length(1);
        component.users.push(valueToAdd);
    });

    it("check push with multiple items - users", function (done) {
        let valueToAdd = { name: 'batman gupta' };
        let prop = "users.push";
        const eventId = component.watch(prop, (newValue, oldVal) => {
            expect(newValue).eql([valueToAdd, valueToAdd]);
            expect(oldVal).equal(undefined);
            component.unwatch(prop, eventId);
            expect(component['_watchBus_']._events_[prop]).length(0);
            expect(component.users).length(4);
            done();
        });
        expect(component['_watchBus_']._events_[prop]).length(1);
        component.users.push(valueToAdd, valueToAdd);
    });
});


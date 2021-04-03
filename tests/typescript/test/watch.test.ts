import { app } from "../src/index";
import { nextTick, Children, Template, Reactive, Component } from "mahal";
import { expect } from "chai";


@Template(`
<div>
     
</div>
`)
class Temp extends Component {

    @Reactive
    name = ""

    @Reactive
    users = []

}

describe('MODEL TextBox', function () {

    let component: Temp;

    before(async function () {
        component = await (app as any).mount(Temp);
    });

    it("check reactive of primitive property - name", function (done) {
        let newName = "ujjwal";
        let prop = "name";
        component.watch(prop, (newVal, oldVal) => {
            expect(newVal).equal(newName);
            expect(oldVal).equal("");
            component.unwatch(prop);
            expect(component['_watchBus']._events[prop]).length(0);
            done();
        });
        expect(component['_watchBus']._events[prop]).length(1);
        component.name = newName;
    });

    it("check reactive of array property - users", function (done) {
        let newVal = [{ name: 'ujjwal' }];
        let prop = "users";
        component.watch(prop, (newVal, oldVal) => {
            expect(newVal).equal(newVal);
            expect(oldVal).length(0);
            component.unwatch(prop);
            expect(component['_watchBus']._events[prop]).length(0);
            done();
        });
        expect(component['_watchBus']._events[prop]).length(1);
        component[prop] = newVal;
    });

    it("check push of array property - users", function (done) {
        let newVal = { name: 'ujjwal gupta' };
        let prop = "users.push";
        debugger;
        component.watch(prop, (newVal, oldVal) => {
            expect(newVal).equal(newVal);
            expect(oldVal).length(0);
            component.unwatch(prop);
            expect(component['_watchBus']._events[prop]).length(0);
            done();
        });
        expect(component['_watchBus']._events[prop]).length(1);
        component.users.push(newVal);
    });
});


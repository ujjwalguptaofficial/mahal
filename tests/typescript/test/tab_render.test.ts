import TabRender from "../src/components/tab_render";
import { app } from "../src/index";
import { nextTick } from "mahal";
import { expect } from "chai";

describe('TAB RENDER', function () {

    let component;

    before(async function () {
        component = await (app as any).initiate(TabRender);
    });

    const testBtn = (done) => {
        const tabNameDiv = component.find('.tab-name');
        const activeDiv = component.find('.tab.active');
        expect(activeDiv.innerHTML).equal(component.activeTab);
        expect(tabNameDiv.innerHTML).equal(component.activeTab);
        expect(component.find('.btn')).to.not.equal(null);
        expect(component.findAll('.tab')).length(component.tabs.length);
        done();
    }

    const testUser = (done) => {
        const tabNameDiv = component.find('.tab-name');
        const activeDiv = component.find('.tab.active');
        expect(activeDiv.innerHTML).equal(component.activeTab);
        expect(tabNameDiv.innerHTML).equal(component.activeTab);
        expect(component.findAll('.user-comp')).length(2);
        expect(component.findAll('.users')).length(1);
        expect(component.findAll('.reactive-users')).length(1);
        expect(component.findAll('.tab')).length(component.tabs.length);
        done();
    }

    for (let i = 0; i < 2; i++) {
        it(`check for active tab btn at index - ${i}`, function (done) {
            component.activeTab = "Btn";
            setTimeout(() => {
                testBtn(done);
            }, 100);
        });

        it(`change activeTab & check - index - ${i}`, function (done) {
            setTimeout(() => {
                component.activeTab = "Users";
                component.waitFor('update').then(() => {
                    testUser(done);
                })
            }, 100);
        });
    }

    it(`make component null`, async function () {
        component.activeTab = null;
        await component.waitFor("update");
        let childsLength = component.find("div.tab-content").childElementCount
        expect(childsLength).equal(0);
        component.activeTab = "Btn";
        await component.waitFor("update");
        childsLength = component.find("div.tab-content").childElementCount
        expect(childsLength).equal(1);
    });

});


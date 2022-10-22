import ModelComponent from "../src/components/model";
import { app } from "../src/index";
import { nextTick } from "mahal";
import { expect } from "chai";
import { mount, setInputValue } from "@mahaljs/test-utils";

describe('MODEL', function () {

    let component: ModelComponent

    before(async function () {
        component = await mount(ModelComponent);
    });

    describe('input type text', () => {
        it("from component to element", function (done) {
            const input: HTMLInputElement = component.find('input.text') as any;
            expect(input.value).equal('undefined');
            component.text = "ujjwal";
            nextTick(() => {
                expect(input.value).equal('ujjwal');
                done();
            })
        });

        it("from element to component", function () {
            const input = component.find('input.text');
            setInputValue(input, 'random');
            expect(component.text).equal('random');
        });
    })

    describe('textarea', () => {
        it("from component to element", function (done) {
            const input: HTMLInputElement = component.find('.textarea') as any;
            expect(input.value).equal('undefined');
            component.textareaValue = "ujjwal";
            nextTick(() => {
                expect(input.value).equal('ujjwal');
                done();
            })
        });

        it("from element to component", function () {
            const input = component.find('.textarea');
            setInputValue(input, 'random');
            expect(component.textareaValue).equal('random');
        });
    })

    describe('input type checkbox', () => {
        it("from component to element", async function () {
            const input: HTMLInputElement = component.find('input.checkbox') as any;
            expect(input.checked).equal(false);

            component.checkboxValue = true;
            await component.waitFor('update');
            expect(input.checked).equal(true);

        });

        it("from element to component", async function () {
            const input: HTMLInputElement = component.find('input.checkbox') as any;

            // set false
            setInputValue(input, false);
            expect(component.checkboxValue).equal(false);
        });
    })
});


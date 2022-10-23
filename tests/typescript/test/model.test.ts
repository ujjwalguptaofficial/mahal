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

    describe('input type radio', () => {
        it("from component to element", async function () {
            const input1: HTMLInputElement = component.find('.radio.one') as any;
            expect(input1.checked).equal(true);

            const input2: HTMLInputElement = component.find('.radio.two') as any;
            expect(input2.checked).equal(false);

            component.radioButtonValue = "female";
            await component.waitFor('update');

            expect(input1.checked).equal(false);
            expect(input2.checked).equal(true);

        });

        it("from element to component", async function () {
            const input1: HTMLInputElement = component.find('.radio.one') as any;
            expect(input1.checked).equal(false);

            expect(component.radioButtonValue).equal('female');

            // set false
            input1.click();
            expect(component.radioButtonValue).equal('male');
            expect(input1.checked).equal(true);

            const input2: HTMLInputElement = component.find('.radio.two') as any;
            expect(input2.checked).equal(false);

        });
    })

    describe('select', () => {
        it("from component to element", async function () {
            const input: HTMLInputElement = component.find('.dropdown') as any;
            expect(input.value).equal(component.selectValue);

            component.selectValue = "saab";
            await component.waitFor('update');
            expect(input.value).equal(component.selectValue);

        });

        it("from element to component", async function () {
            const input: HTMLInputElement = component.find('.dropdown') as any;

            // set false
            setInputValue(input, "volvo");
            expect(input.value).equal(
                component.selectValue
            );
        });
    })
});


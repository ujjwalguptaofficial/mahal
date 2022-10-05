import { app } from "../src/index";
import { nextTick, children, reactive, Component, EventBus } from "mahal";
import { expect } from "chai";
import { template } from "@mahaljs/util";
import Btn from "../src/components/btn";

@template(`
<div>
		<div :for(item,index in list) class="row mt-2" :key="item.question" :question='item.question' :answer='item.answer'>
			<b  @click="toggleAnswerFAQ(index)" class="question" :question='item.question' :index="index">
				<div>{{item.question}}</div>
				<i class="fa fa-chevron-down"></i>
			</b>
            <p class="items-index">{{items}} {{indexes}}</p>
			<div class="answer" :show(item.show) :html(item.answer) :answer="item.answer"></div>
		<Btn :label="item.answer"/>
        </div>
</div>
`)
@children({
    Btn
})
export default class Temp extends Component {

    onInit() {
        window['compD'] = this;
    }

    items = "ujjwal"
    indexes = "gupta"

    @reactive
    list = [
        {
            question: "What is NFT ?",
            answer: "NFT stands for non fungible tokens. It represents digital record of different art on blockchain. <br><br> The people who buys NFT's - they own the digital record of that art. People buy NFT due to multiple reasons - showcase (as there is only one NFT in whole world), investment , support the artist etc .",
        },
    ];

    toggleAnswerFAQ(index) {
        this.list[index] = {
            ...this.list[index],
            show: !Boolean(this.list[index]['show']),
        } as any;
    }
}

describe('Directive in for', function () {

    let component: Temp;

    before(async function () {
        component = await (app as any).mount(Temp);
    });

    it('check initial state', async () => {
        const answerEl = component.find('.answer');
        expect(answerEl.style.display).equal('none');
        // expect(component['_watchBus_']._events_["list.0"] || []).length(0);
        // expect(component['_watchBus_']._events_["list.0.show"]).length(1);
    })

    it('show answer', async () => {
        const questionEl = component.find('.question');
        questionEl.click();
        await component.waitFor('update');

        const answerEl = component.find('.answer');
        const display = answerEl.style.display;
        expect(display).equal('unset');
        expect(display).not.equal('none');
    })

    it('hide answer', async () => {
        const questionEl = component.find('.question');
        questionEl.click();
        await component.waitFor('update');

        const answerEl = component.find('.answer');
        const display = answerEl.style.display;
        expect(display).equal('none');
    })

    it('check items indexes', async () => {
        const itemsIndexesEl = component.find('.items-index');
        expect(itemsIndexesEl.innerHTML).equal(`ujjwal gupta`);
    })

    it('check props reactivity', async () => {

        const checkQuestionProp = () => {
            const questionEl = component.find('.question');
            const questionText = questionEl.getAttribute('question');
            expect(questionText).equal(component.list[0].question);

            const indexText = questionEl.getAttribute('index');
            expect(indexText).equal('0');

            const row = component.find('.row');

            const rowText = row.getAttribute('question');
            expect(rowText).equal(component.list[0].question);
        }

        // check questions

        checkQuestionProp();


        // change question to check reactivity
        component.list[0] = {
            ...component.list[0],
            ...{
                question: 'Hello',
            }
        }

        await component.waitFor('update');
        checkQuestionProp();

        const checkAnswer = () => {
            const newAnswer = component.list[0].answer;

            const row = component.find('.row');

            const rowText = row.getAttribute('answer');
            expect(rowText).equal(newAnswer);

            // check for attribute
            const answerEl = component.find('.answer');
            const answerElAttributeAnswer = answerEl.getAttribute('answer');
            expect(answerElAttributeAnswer).equal(newAnswer);

            // check for inner html
            expect(answerEl.innerHTML).equal(newAnswer);

            // check for btn

            const answerBtn = component.find('button.btn');
            expect(answerBtn.innerText).equal(
                newAnswer.toUpperCase()
            );
        }


        checkAnswer();
        // change answer to check reactivity

        component.list[0] = {
            ...component.list[0],
            ...{
                answer: 'World',
            }
        }

        await component.waitFor('update');
        checkQuestionProp();
        checkAnswer();

    })

});


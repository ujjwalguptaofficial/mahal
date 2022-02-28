import { expect } from "chai";
import { createComponent } from "./create_component";
import { mount } from "mahal-test-utils";
import { Component, HTML_TAG } from "mahal";


describe('simple', function () {

    const testTag = async (text: string, expectedTag: string) => {
        const compClass = createComponent(`
        ${text}
             `)

        const component = await mount<Component>(compClass);
        const btn = component.element;
        expect(btn.tagName).equal(expectedTag);
        return btn;
    }

    it('div', () => {
        return testTag(`<div>{{ujjwal}}</div>`, 'DIV');
    })

    it('comment', async () => {
        const el = await testTag(`<div><!-- Author of JsStore  --></div>`, 'DIV');
    })


    it('h1 tag', () => {
        return testTag(`<h1>Title</h1>`, 'H1');
    })

    it('a with href as #', () => {
        return testTag(`
        <a href="#">Title</a>
      `, 'A');
    })

    it('nav', () => {
        return testTag(`
        <nav>Title</nav>
      `, 'NAV');
    })

    it('i', () => {
        return testTag(`
        <i>Title</i>
      `, 'I');
    })

    it('img tag', () => {
        const text = `
			<img class="img-fluid img-profile rounded-circle mx-auto mb-2" src="img/profile.png" alt="profile" />
`;
        return testTag(text, 'IMG');

    })
    it('br tag', () => {
        const text = `
			<br class="img-fluid img-profile rounded-circle mx-auto mb-2" src="img/profile.png" alt="profile" />
`;
        return testTag(text, 'BR');

    })

    it('custom tag', () => {
        HTML_TAG['custom'] = true;
        const text = `
			<custom class="img-fluid img-profile rounded-circle mx-auto mb-2" src="img/profile.png" alt="profile" />
`;
        return testTag(text, 'CUSTOM');

    })

})
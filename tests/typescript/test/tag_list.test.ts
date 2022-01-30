import { createRenderer } from "mahal-html-compiler";
import { expect } from "chai";
import { createComponent } from "./create_component";
import { mount } from "mahal-test-utils";
import { HTML_TAG } from "mahal";


describe('simple', function () {

    const testTag = async (text: string, expectedTag: string) => {
        const compClass = createComponent(`
        ${text}
             `)

        const component = await mount(compClass);
        const btn = component.element;
        expect(btn.tagName).equal(expectedTag)
    }

    it('div', () => {
        return testTag(`<div>{{ujjwal}}</div>`, 'DIV');
    })


    it('h1 tag', () => {
        return testTag(`<h1>Title</h1>`, 'H1');
    })

    it('a with href as #', () => {
        return testTag(`
        <a href="#">Title</a>
      `, 'A');
    })

    it('img tag', () => {
        const text = `
			<img class="img-fluid img-profile rounded-circle mx-auto mb-2" src="img/profile.png" alt="profile" />
`;
        return testTag(text, 'IMG');

    })

    it('custom tag', () => {
        HTML_TAG['custom'] = true;
        const text = `
			<custom class="img-fluid img-profile rounded-circle mx-auto mb-2" src="img/profile.png" alt="profile" />
`;
        return testTag(text, 'CUSTOM');

    })

})
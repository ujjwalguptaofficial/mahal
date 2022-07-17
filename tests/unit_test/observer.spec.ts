import { ArrayComp } from "./array_nested_elemet_destory.test";
import { expect } from "chai";
import { Observer } from "../../src/helpers/observer";

describe('Observer', () => {


    it('simple', (done) => {
        const value = {
            name: 'ujjwal'
        }
        const comp = new ArrayComp();
        const observer = new Observer((key, newValue, oldValue) => {
            expect(key).equal('name');
            expect(newValue).equal('commander');
            expect(oldValue).equal('ujjwal');
            observer.destroy();
            expect(observer.onChange).to.be.null;
            done();
        }, comp as any);
        const ob = observer.create(value);
        ob.name = 'commander';
    })

    it('nested object', (done) => {
        const value = {
            name: 'ujjwal',
            details: {
                detail1: 'detail1Value'
            }
        }
        const comp = new ArrayComp();
        let index = 0;
        const observer = new Observer((key, newValue, oldValue) => {
            switch (index) {
                case 0:
                    expect(key).equal('details');
                    expect(newValue).to.eql({
                        detail2: 'detail2Value'
                    })
                    expect(oldValue).eql({
                        detail1: 'detail1Value'
                    });
                    break;
                case 1:
                    expect(key).equal('details.detail1');
                    expect(newValue).to.be.undefined;
                    expect(oldValue).equal('detail1Value');
                    break;
                case 2:
                    expect(key).equal('details.detail2');
                    expect(newValue).equal('detail2Value');
                    expect(oldValue).to.be.undefined;
                    observer.destroy();
                    expect(observer.onChange).to.be.null;
                    done();
            }

            index++;
            // console.log('key', key);
            // console.log('newvalue', newValue);
            // console.log('oldValue', oldValue);

        }, comp as any);
        const ob = observer.create(value);
        ob.details = {
            detail2: 'detail2Value'
        };
    })


})
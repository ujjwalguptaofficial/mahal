import { expect } from "chai";
import { EventBus, Timer } from "mahal"

describe('event bus', () => {
    const eventBus = new EventBus();

    let eventIds = [];

    it('on', () => {
        eventIds.push(
            eventBus.on('ev', () => {
                return 5;
            })
        )
        eventIds.push(
            eventBus.on('ev', () => {
                return Promise.resolve(10);
            })
        );

        expect(eventBus.getEvent('ev')).length(2);
    })

    it('emit', async () => {
        const results = await eventBus.emit('ev');

        expect(results).eql([5, 10]);
    });

    it('off', () => {
        eventBus.off('ev', eventIds[0])
        eventBus.off('ev', eventIds[1]);

        expect(eventBus.getEvent('ev')).length(0);
    })

    it('emitLinear', async () => {
        let isFirstCompleted = false;
        let isSecondCompleted = false;
        const evId1 = eventBus.on('ev', () => {
            return new Timer().timeout(500).then(_ => {
                isFirstCompleted = true;
                return 5;
            })
        })
        const evId2 = eventBus.on('ev', () => {
            expect(isFirstCompleted).equal(true);
            return new Timer().timeout(100).then(_ => {
                isSecondCompleted = true;
                return Promise.resolve(10);
            })
        })

        const results = await eventBus.emitLinear('ev');
        expect(isSecondCompleted).equal(true);
        expect(results).eql([5, 10]);
        eventBus.off('ev', evId1);
        eventBus.off('ev', evId2);
    });

    it('emitLinear with removing a event in execution', (done) => {

        const evId1 = eventBus.on('ev', () => {
            return new Timer().timeout(500).then(_ => {
                return 5;
            })
        })
        const cb = () => {
            return new Timer().timeout(100).then(_ => {
                return Promise.resolve(10);
            })
        };
        const evId2 = eventBus.on('ev', cb)

        eventBus.emitLinear('ev').then(results => {
            expect(results).eql([5, 10]);
            done();
        });
        eventBus.off('ev', evId1);
        eventBus.on('ev', () => {
            return 15;
        })
    });
})
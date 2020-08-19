(function anonymous(
) {
    const ctx = this;
    const ce = ctx.createElement.bind(ctx);
    const ct = ctx.createTextNode.bind(ctx);
    const cc = ctx.createCommentNode;
    const sife = ctx.storeIfExp_.bind(ctx);
    const sfore = ctx.storeForExp_.bind(ctx);
    const unique = ctx.unique;
    return ce('div', [ct('        '),
    ce('button', [ct('Show Div'),
    ], { on: { click: ctx.toggleFlag } }),
    ct('        '),
    ce('button', [ct('Increment Counter'),
    ], { on: { click: ctx.incrementCounter } }),
    ct('        '),
    ce('button', [ct('Additem'),
    ], { on: { click: ctx.addItem } }),
    ct('        '),
    ce('div', [ct(ctx.counter, 'counter'),
    ], {}),
    ct('        '),
    sife(() => { return ctx.flagOne }, (ifCond) => {
        return ifCond ? ce('div', [ce('b', [ct('ujj'),], {}),], {}) :
            ctx.flagTwo ? ce('div', [ct('ok'),], {}) :
                // ctx.flagTwo ? ce('div', [ct('ok'),], {}) ?
                ce('div', [ct('word'),], {})
    }, ['flagOne', 'flagTwo',], unique),
    ], { on: { click: () => { ctx.flag = 1 } } })
})
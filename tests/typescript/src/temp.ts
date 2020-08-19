// const ctx = this;
// const ce = ctx.createElement.bind(ctx);
// const ct = ctx.createTextNode.bind(ctx);
// const cc = ctx.createCommentNode;
// const sife = ctx.storeIfExp_.bind(ctx);
// const sfore = ctx.storeForExp_.bind(ctx);
// const unique = ctx.unique;
// return ce('div', [
//     ct('        '),
//     ce('button', [ct('Show Div'),], { on: { click: ctx.toggleFlag } }),
//     ct('        '),
//     ce('button', [ct('Increment Counter'),], { on: { click: ctx.incrementCounter } }),
//     ct('        '),
//     ce('button', [ct('Additem'),], { on: { click: ctx.addItem } }),
//     ct('        '),
//     ce('div', [ct(ctx.counter, 'counter'),], {}),
//     ct('        '),
//     ce('button', [ct('Change FlagOne'),], { on: { click: ctx.toggleFlagOne } }),
//     ct('       '),
//     ce('button', [ct('Change FlagTwo'),], { on: { click: ctx.toggleFlagTwo } }),
//     ct('        '),
//     sife(() => {
//         return ctx.flagOne ? ce('div', [ce('b', [ct('Flag one rendered'),], {}),], {}) :
//             ctx.flagTwo ? ce('div', [ct('Flag two rendered'),], {}) :
//                 ce('div', [ct('else rendered'),], {})
//     }, ['flagOne', 'flagTwo',], unique),
// ], {})
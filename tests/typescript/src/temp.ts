// const ctx = this;
// const ce = ctx.createElement.bind(ctx);
// const ct = ctx.createTextNode.bind(ctx);
// const cc = ctx.createCommentNode;
// const sife = ctx.storeIfExp_.bind(ctx);
// const sfore = ctx.storeForExp_.bind(ctx);
// const unique = ctx.unique;
// const f = ctx.filter.bind(this);
// return ce('div', [,
//     ce('span', [,
//         ct(f('toUpper', "ujjwal")), ,
//     ], {
//         attr: {
//             id: {
//                 v: 'testFilter'
//             }
//         }
//     }), ,
//     ce('span', [ct(f('toUpper', ctx.name)), $ {
//         compiled.mustacheExp
//     }, ], {
//         attr: {
//             id: {
//                 v: 'name'
//             }
//         }
//     }), ,
//     ce('button', [,
//         ct(ctx.count), ${
//             compiled.mustacheExp
//         }, ,
//     ], {
//         on: {
//             click: ctx.onClick
//         },
//         attr: {
//             id: {
//                 v: 'count'
//             }
//         }
//     }), ,
//     ce('button', [ct('Destory'), ], {
//         on: {
//             click: ctx.destroy
//         }
//     }), ,
//     ce('p', [], {
//         html: ctx.myHtml,
//         attr: {
//             class: {
//                 v: 'p-html'
//             }
//         }
//     }), ,
// ], {})
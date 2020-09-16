// (function anonymous(ce, ct, f, he, hForE
// ) {
//     const ctx = this;
//     return ce('div', [ce('div', [ct('toggle'),], {
//         on: {
//             click: ctx.toggleFlag
//         },
//         attr: {
//             name: {
//                 v: ctx.name,
//                 k: 'name'
//             }
//         }
//     }), ce('div', [ct('SHowHide'),], {
//         dir: {
//             show: {
//                 value: () => {
//                     return ctx.flag
//                 },
//                 props: ['flag']
//             }
//         },
//     }
//     }), ce('div', [he(() => {
//         return ct(ctx.name)
//     }, ['name'], 1),], {
//         on: {
//             click: ctx.onClick
//         }
//     }), ce('TextBox', [], {
//         dir: {
//             model: {
//                 value: () => {
//                     return ctx.name
//                 },
//                 props: ['name']
//             }
//         },
//     }), ce('ObjectComponent', [], {}), ], { })
//     })
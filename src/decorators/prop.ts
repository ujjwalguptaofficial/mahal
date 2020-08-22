
// export const Prop = (target: any, propertyName: string) => {
//     const className = (target.constructor.name as string);
//     return function (payload) {
//         target['props'][propertyName] = payload;
//     }
// };

import { IPropOption } from "../interface";

export function Prop(options?: IPropOption | any) {
    return (target, key: string) => {
        if (!target.props) {
            target.props = {};
        }
        target.props[key] = options;
    }
}

// class Demo{

//     @Prop("ss")
//     name;
// }
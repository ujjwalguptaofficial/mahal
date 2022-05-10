import { MAHAL_KEY } from "../constant";

export const getElementKey = (el) => {
    return el[MAHAL_KEY];
};

// export const isNodeNotEqual = (el1, el2) => {
//     const elKey = getElementKey(el1);
//     return elKey == null || elKey !== getElementKey(el2)
// }
import { ILazyComponent } from "../interface";
import { getDataype } from "./get_data_type";

export interface ILazyComponentPayload {
    component: () => Promise<any>;
    loading: {
        component: () => Promise<any>;
        delay: number
    };
    error: {
        component: () => Promise<any>;
    };
    timeout: number;
}
export const lazyComponent = (component: Function | ILazyComponentPayload): ILazyComponent => {
    if (getDataype(component) === "function") {
        return {
            isLazy: true,
            component: component as any
        };
    }
};
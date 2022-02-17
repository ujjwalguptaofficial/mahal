import { ILazyComponent } from "../interface"

interface ILazyComponentPayload {
    component: () => Promise<any>;
    loading: {
        component: () => Promise<any>;
        delay: number
    },
    error: {
        component: () => Promise<any>;
    },
    timeout: number
}
export const lazyComponent = (component: Function | ILazyComponentPayload): ILazyComponent => {
    if (typeof component === 'function') {
        return {
            isLazy: true,
            component: component
        }
    }
}
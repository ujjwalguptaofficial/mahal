import { IErrorType } from "../interface"

export const ERROR_TYPE = {
    InvalidComponent: 'invalid_component',
    InvalidFormatter: "invalid_formatter",
    PropDataTypeMismatch: "prop_data_type_mismatch",
    RendererNotFound: "createRenderer_not_found",
} as any as IErrorType;

if (process.env.NODE_ENV !== 'production') {
    Object.assign(ERROR_TYPE, {
        ForOnPrimitiveOrNull: "for_on_primitive|null",
        InvalidEventHandler: "invalid_event_handler",
        SetSameValue: "set_same_value",
        MutatingProp: "mutating_prop",
    })
}
import { IErrorType } from "../interface";

export const ERROR_TYPE = {
    InvalidFormatter: "invalid_formatter",
    PropDataTypeMismatch: "prop_data_type_mismatch",
} as any as IErrorType;

if (process.env.NODE_ENV !== 'production') {
    Object.assign(ERROR_TYPE, {
        InvalidComponent: 'invalid_component',
        ForOnPrimitiveOrNull: "for_on_primitive|null",
        InvalidEventHandler: "invalid_event_handler",
        SetSameValue: "set_same_value",
        MutatingProp: "mutating_prop",
        RendererNotFound: "createRenderer_not_found",
        InvalidSlotTarget: "invalid_slot_target"
    });
}
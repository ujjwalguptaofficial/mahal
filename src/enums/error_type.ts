export enum ERROR_TYPE {
    InvalidComponent = 'invalid_component',
    SynTaxError = 'syntax_error',
    ForExpAsRoot = "for_exp_as_root",
    ForOnPrimitiveOrNull = "for_on_primitive|null",
    InvalidEventHandler = "invalid_event_handler",
    InvalidFormatter = "invalid_formatter",
    PropDataTypeMismatch = "prop_data_type_mismatch",
    RendererNotFound = "createRenderer_not_found",
    MutatingProp = "mutating_prop",
    SetSameValue = "set_same_value"
}
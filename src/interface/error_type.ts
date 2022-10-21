export interface IErrorType {
    InvalidComponent: 'invalid_component';
    InvalidFormatter: "invalid_formatter";
    PropDataTypeMismatch: "prop_data_type_mismatch";
    RendererNotFound: "createRenderer_not_found";
    ForOnPrimitiveOrNull: "for_on_primitive|null";
    InvalidEventHandler: "invalid_event_handler";
    SetSameValue: "set_same_value";
    MutatingProp: "mutating_prop";
    InvalidSlotTarget: "invalid_slot_target";
}
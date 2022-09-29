export type TYPE_EVENT_STORE = {
    [key: string]: Map<Function, boolean>
};
export type TYPE_ALL_LIFE_CYCLE_EVENT = "destroy" | "mount" | "create" | "update" | "error";
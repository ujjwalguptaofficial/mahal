export type TYPE_RC_STORAGE = Map<string, HTMLElement[]>;
export type TYPE_EVENT_STORE = {
    [key: string]: Map<Function, boolean>
};
export type TYPE_ALL_LIFE_CYCLE_EVENT = "destroy" | "mount" | "create" | "update" | "error";
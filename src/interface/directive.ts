export interface IDirective {
    created: (value) => void;
    inserted: () => void;
    valueUpdated: (value) => void;
    destroyed: () => void;
}
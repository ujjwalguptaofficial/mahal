export interface IDirective {
    inserted: () => void;
    valueUpdated: () => void;
    destroyed: () => void;
}
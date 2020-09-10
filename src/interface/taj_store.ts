export interface ITajStore {

    getter?;
    mutation?;
    task?;
    state?;

    commit?(mutationName: string, payload?);

    watch?(name: string, cb: (newValue?, oldValue?) => void);
    unwatch?(name: string, cb);

}
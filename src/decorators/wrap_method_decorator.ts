export function wrapMethodDecorator(args: any[], executor: Function) {
    if (args.length >= 2) {
        const [target, propertyName] = args;
        executor(target, propertyName, null);
        return;
    }
    return (target, key: string) => {
        executor(target, key, args[0]);
    };
}
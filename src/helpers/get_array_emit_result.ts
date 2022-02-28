export const getArrayEmitResult = (target, prop, args, result) => {
    switch (prop) {
        case 'push':
            return {
                value: args[0],
                key: result - 1,
                length: result
            };
        case 'pop':
            return (target as any).length;
        case 'reverse':
            return {
                length: (target as any).length,
                value: result
            };
        // case 'unshift':
        //     return 0;
        default:
            return args;
    }
};
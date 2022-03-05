export const getArrayEmitResult = (target, prop, args, result) => {
    switch (prop) {
        case 'push':
            return args;
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
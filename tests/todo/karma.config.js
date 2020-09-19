module.exports = function (config) {
    config.set({
        frameworks: ["mocha", "karma-typescript"],
        files: [
            "src/**/*.ts",
            "test/**/*.ts" // *.tsx for React Jsx
        ],
        // client: {
        //     karmaHTML: {
        //         source: [
        //             { src: './src/index.html', tag: 'index' },
        //         ]
        //     }
        // },
        preprocessors: {
            "**/*.ts": "karma-typescript" // *.tsx for React Jsx
        },
        reporters: ["progress", "karma-typescript"],
        browsers: ["Chrome"]
    });
};
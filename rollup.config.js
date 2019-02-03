import commonJs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import { eslint } from "rollup-plugin-eslint";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

module.exports = [
    defineApp("center-on-material"),
    defineApp("tiling-assistant")
];

function defineApp(appFolder) {
    return {
        input: `${appFolder}/main.js`,
        output: {
            file: `dist/bundle-${appFolder}.js`,
            format: "iife",
            name: "App",
            sourcemap: true,
            sourcemapExcludeSources: true,
            footer: `
    var app = new App();

    function properties(args) {
        return app.propertiesWrapper(args);
    }

    function executor(args, success, failure) {
        app.executorWrapper(args, success, failure);
    }
`
        },
        plugins: [
            eslint(),
            nodeResolve({
                jsnext: true,
                browser: true
            }),
            commonJs({
                include: "node_modules/**"
            }),
            babel({
                exclude: "node_modules/**",
                plugins: ["lodash"]
            }),
            terser({
                sourcemap: true
            })
        ]
    };
}

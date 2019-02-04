import _ from "lodash";
import commonJs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import { eslint } from "rollup-plugin-eslint";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import root from "root-path";

const appFinder = require("./deploy/appFinder");

const apps = appFinder.getApps();

module.exports = _.map(apps, app => defineApp(app.name));

function defineApp(name) {
    return {
        input: root(`apps/${name}/app.js`),
        output: {
            file: `dist/bundle-${name}.js`,
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
            eslint({
                throwOnError: true,
                throwOnWarning: true
            }),
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

import _ from "lodash";
import fs from "fs";
import glob from "glob";
import root from "root-path";

export default {
    getApps,

    _loadEditProps
};

function getApps() {
    const appJsonFilePaths = glob.sync(root("apps/**/app.json"));

    return _.map(appJsonFilePaths, (appJsonFilePath) => {
        const [, name] = appJsonFilePath.match(/\/([^/]*)\/app.json/);
        const appJson = JSON.parse(fs.readFileSync(appJsonFilePath));

        const editProps = this._loadEditProps(name);

        return {
            ...appJson,
            name,
            bundleFilePath: root(`dist/bundle-${name}.js`),
            editProps
        };
    });
}

function _loadEditProps(name) {
    try {
        const editPropsFilePath = root(`apps/${name}/editProps.cache.txt`);
        const editPropsBuffer = fs.readFileSync(editPropsFilePath);
        const editPropsText = editPropsBuffer.toString();

        return _(editPropsText.split("\n"))
            .map(line => line.split(": ", 2))
            .fromPairs()
            .value();
    } catch (err) {
        return {};
    }
}

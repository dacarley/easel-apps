const _ = require("lodash");
const fs = require("fs");
const glob = require("glob");
const root = require("root-path");

module.exports = {
    getApps,

    _loadEditProps
};

function getApps() {
    const metaFilePaths = glob.sync(root("apps/**/meta.js"));

    return _.map(metaFilePaths, (metaFilePath) => {
        const [, name] = metaFilePath.match(/\/([^/]*)\/meta.js/);
        const meta = require(metaFilePath);

        const editProps = this._loadEditProps(name);

        return {
            meta,
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

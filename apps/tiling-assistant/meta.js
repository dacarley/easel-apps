const fs = require("fs");

module.exports = {
    appNumber: 271,
    name: "Tiling Assistant",
    description: fs.readFileSync(`${__dirname}/description.md`)
};

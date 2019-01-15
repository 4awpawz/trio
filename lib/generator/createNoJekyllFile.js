const fs = require("fs-extra");
const config = require("../config");

module.exports = () => {
    const path = config.publicNoJekyll;
    fs.ensureFileSync(path);
};
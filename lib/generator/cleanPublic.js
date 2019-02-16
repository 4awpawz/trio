const fs = require("fs-extra");
const glob = require("glob");
const { parse } = require("path");
const config = require("../config");
const { log } = require("../utils");

module.exports = stalePage => {
    log("cleaning public folder");
    const dir = parse(stalePage).dir;
    fs.removeSync(stalePage);
    try {
        dir !== config.public &&
            glob.sync(`${dir}/**/*.*`).length === 0 &&
            fs.removeSync(dir);
    } catch (error) {
        log(error);
    }
};
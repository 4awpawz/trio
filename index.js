"use strict";
const generate = require("./lib/generator");
const { log } = require("./lib/utils");

module.exports = async (path) => {
    const seperator = "*********************************************************";
    log(seperator);
    if (process.env.TRIO_ENV_buildType === "release") {
        log("building site for release");
    } else {
        log("building site for development");
    }
    await generate(path).catch((e) => { log(e); });
    log(seperator);
};
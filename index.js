const generate = require("./lib/generator");
const { log } = require("./lib/utils");

// ToDo: Validate that this is a project before proceding.
module.exports = async (path) => {
    if (process.env.TRIO_ENV_buildType === "release") {
        log("building public folder for release");
    } else {
        log("building public folder for development");
    }
    await generate(path).catch((e) => { log(e); });
};
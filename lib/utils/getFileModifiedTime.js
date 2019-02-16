/**
 * Returns the time in ms when file's (path) data was last modified
 */
const { statSync } = require("fs-extra");
const { log } = require("../utils");

module.exports = path => {
    // ToDo: use existsSync instead of try/catch here
    try {
        var stats = statSync(path);
    } catch (error) {
        log(error);
        process.exit();
    }
    return stats.mtimeMs;
};
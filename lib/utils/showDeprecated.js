const { warn } = require("./warn");

module.exports = (when, what, nextVersion, message) =>
    warn(`WARNING! As of ${when} "${what}" has been deprecated and will be removed in ${nextVersion}. ${message}`);

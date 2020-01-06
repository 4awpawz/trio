const { warn } = require("./warn");

module.exports = (when, what, nextVersion, message) =>
    warn(`Warning: As of ${when} "${what}" has been deprecated and will be removed in ${nextVersion}. ${message}`);

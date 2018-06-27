// require("make-promises-safe"); // installs an 'unhandledRejection' handler
const generate = require("./lib/pipeline");

module.exports = async () => generate().catch(() => { });
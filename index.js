const generate = require("./lib/pipeline");

// main entry point with "top level" promise rejection handler
// to prevent "unhandled promise rejection" errors
module.exports = async () => generate().catch((e) => { console.log(e); });
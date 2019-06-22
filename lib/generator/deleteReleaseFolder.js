const { removeSync } = require("fs-extra");
const config = require("../config");

module.exports = () => removeSync(`${config.release}`);
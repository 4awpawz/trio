const { existsSync } = require("fs-extra");
const { statsFileName } = require("../config/fileNames");

module.exports = () => existsSync(statsFileName);
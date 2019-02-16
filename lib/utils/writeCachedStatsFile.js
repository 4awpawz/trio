const { ensureDirSync, writeJSONSync } = require("fs-extra");
const { parse } = require("path");
const { statsFileName } = require("../config/fileNames");

module.exports = stats => {
    ensureDirSync(parse(statsFileName).dir);
    writeJSONSync(statsFileName, stats, { spaces: "    " });
};
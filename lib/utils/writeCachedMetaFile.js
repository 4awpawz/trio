const { ensureDirSync, writeJSONSync } = require("fs-extra");
const { parse } = require("path");
const { metaFileName } = require("../config/fileNames");

module.exports = meta => {
    ensureDirSync(parse(metaFileName).dir);
    writeJSONSync(metaFileName, meta, { spaces: "" });
};
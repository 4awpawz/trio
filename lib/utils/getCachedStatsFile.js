/**
 * Inforeces the fact that the cached stats file is always read only.
 */

const importFresh = require("import-fresh");
const { statsFileName } = require("../config/fileNames");

module.exports = () => importFresh(statsFileName);
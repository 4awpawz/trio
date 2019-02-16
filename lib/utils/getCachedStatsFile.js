/**
 * Inforeces the fact that the cached stats file is always read only.
 */
const { statsFileName } = require("../config/fileNames");

module.exports = () => require(statsFileName);
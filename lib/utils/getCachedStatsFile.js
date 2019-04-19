/**
 * Inforeces the fact that the cached stats file is always read only.
 */
const requireUncached = require("require-uncached")
const { statsFileName } = require("../config/fileNames");

module.exports = () => requireUncached(statsFileName);
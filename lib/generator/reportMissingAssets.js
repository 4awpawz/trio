const { log, warn } = require("../utils");

module.exports = missingAssets => {
    warn("WARNING! The following referenced assets can't be found:");
    const maSet = new Set(missingAssets);
    const a = Array.from(maSet);
    a.forEach((missingAsset, i) => {
        log(`${i + 1}) ${missingAsset}`);
    });
};

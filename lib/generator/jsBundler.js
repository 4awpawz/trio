const { pathExistsSync } = require("fs-extra");
const { join } = require("path");
const importFresh = require("import-fresh");
const config = require("../config");

module.exports = async () => {
    const bundler = join(process.cwd(), config.jsBundler);
    pathExistsSync(bundler) && await importFresh(bundler)(process.env.TRIO_ENV_buildType);
};

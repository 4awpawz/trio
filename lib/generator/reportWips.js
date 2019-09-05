/**
 * Logs wips information to the console.
 */
const { log, warn } = require("../utils");

module.exports = (wips, siteMetadata) => {
    wips.length > 0 && log(`Found ${wips.length} wips:`);
    wips.length > 0 && wips.forEach(wip =>
        warn(process.env.TRIO_ENV_buildType === "release"
            ? `    WARNING! Ignoring ${wip}`
            : `    ${wip}`)
    );
};
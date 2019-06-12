/**
 * Logs wips information to the console.
 */
const { log } = require("../utils");

module.exports = (wipsCount, wips, siteMetadata) => {
    wipsCount && log(`Found ${wipsCount} wips:`);

    siteMetadata.wipsCount = wipsCount;
    siteMetadata.wips = wips;

    wipsCount && wips.forEach(wip =>
        log(process.env.TRIO_ENV_buildType === "release"
            ? `    *** warning: ignoring ${wip}`
            : `    *** ${wip}`)
    );
};
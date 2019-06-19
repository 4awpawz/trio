/**
 * Returns an object whose properties represent the project's assets, including wip details.
 * If running a release build, will filter out all wip fragments.
 */
const { parse } = require("path");
const config = require("../config");
const { globFriendly } = require("../utils");

module.exports = () => {
    // get paths to all project assets (fragments, templates, includes, callbacks, .etc)
    let assets = globFriendly(`${config.source}/**/*.*`,
        { dot: true, ignore: ["**/*.DS_Store"] });
    // get list of wips
    const wips = assets.filter(asset => {
        const parseInfo = parse(asset);
        return parseInfo.dir.startsWith(config.fragments) &&
            parseInfo.name.startsWith("_");
    });
    // if release then don't include wips
    assets = process.env.TRIO_ENV_buildType === "release"
        ? assets.filter(asset => !wips.includes(asset))
        : assets;
    return { assets, wips, wipsCount: wips.length };
};
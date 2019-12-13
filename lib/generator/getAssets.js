/**
 * Returns an object whose properties represent the project's assets, including wip details.
 * If running a release build, will filter out all wip fragments.
 */

const { parse } = require("path");
const config = require("../config");
const { globFriendly, isFile } = require("../utils");

module.exports = () => {
    const isWIP = path => {
        const parseInfo = parse(path);
        return parseInfo.dir.startsWith(config.fragments) && parseInfo.name.startsWith("_");
    };

    // get paths to all project assets (generators, fragments, templates, includes, callbacks, .etc)
    const paths = globFriendly(`${config.source}/**/*`,
        { dot: true, ignore: ["**/*.DS_Store"] })
        .filter(asset => isFile(asset));

    const assets = [];
    const wips = [];

    paths.forEach(path => {
        const wip = isWIP(path);
        // collect wips
        wip && wips.push(path);
        // collect assets but don't include wips if release
        ((process.env.TRIO_ENV_buildType === "release" && !wip) ||
        (process.env.TRIO_ENV_buildType !== "release")) && assets.push(path);
    });

    return { assets, wips };
};
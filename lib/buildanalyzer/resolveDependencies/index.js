const getStats = require("./getStats");
const getStale = require("./getStale");
const groupStatsByCategory = require("./groupStatsByCategory");
const {
    doesCachedStatsFileExists,
    getCachedStatsFile,
    getFileModifiedTime,
    log
} = require("../../utils");
const {
    getTemplateDeps,
    getIncludeDeps,
    getCallbackDeps,
    getRequiredModuleDeps,
    getDataDeps,
    getAllIncludeDepsFromResolvedFragment
} = require("./resolvers");
const { statsFileName } = require("../../config/fileNames");

module.exports = () => {
    const cachedStatsFileExists = doesCachedStatsFileExists();
    const timestampMs = cachedStatsFileExists && getFileModifiedTime(statsFileName) || 0;
    const stats = getStats();

    const getAllPathsByCategory = (stats => {
        return category => stats
            .filter(stat => stat.type === category)
            .map(stat => stat.path);
    })(stats);

    // paths to all fragments
    const pathsToAllFrags = getAllPathsByCategory("fragment");
    // paths to all templates
    const pathsToAllTemplates = getAllPathsByCategory("template");
    // paths to all includes
    const pathsToAllIncludes = getAllPathsByCategory("include");
    // paths to all callbacks
    const pathsToAllCallbacks = getAllPathsByCategory("callback");

    console.time("resolvers");
    stats.filter(stat => stat.type === "template")
        .forEach(templateStat =>
            getTemplateDeps(templateStat, pathsToAllFrags));
    stats.filter(stat => stat.type === "include")
        .forEach(includeStat =>
            getIncludeDeps(includeStat, pathsToAllTemplates, pathsToAllFrags));
    stats.filter(stat => stat.type === "callback")
        .forEach(callbackStat =>
            getCallbackDeps(callbackStat, pathsToAllIncludes, pathsToAllTemplates, pathsToAllFrags));
    // console.time("getRequiredModuleDeps");
    stats.filter(stat => stat.type === "module")
        .forEach(moduleStat =>
            getRequiredModuleDeps(moduleStat, pathsToAllCallbacks, pathsToAllIncludes, pathsToAllTemplates, pathsToAllFrags));
    // console.timeEnd("getRequiredModuleDeps");
    stats.filter(stat => stat.type === "data")
        .forEach(dataStat =>
            getDataDeps(dataStat, pathsToAllIncludes, pathsToAllTemplates, pathsToAllFrags));
    console.timeEnd("resolvers");

    const stale = process.env.TRIO_ENV_buildIncrementally ===
        "no-incremental-build"
        ? stats
        : getStale(stats, timestampMs);
    log("stale count:", stale.length);

    const staleCat = groupStatsByCategory(stale);

    const addToSet = set => items => items.forEach(item => set.add(item));

    const resolvedFragmentsSet = new Set();

    // gather all the fragment dependencies into a set to dedupe
    const addToResolvedFragmentsSet = addToSet(resolvedFragmentsSet);

    addToResolvedFragmentsSet(staleCat.fragments
        .map(fragment => fragment.path));
    addToResolvedFragmentsSet(staleCat.templates
        .reduce((accum, template) => accum.concat(template.fragDeps), []));
    addToResolvedFragmentsSet(staleCat.includes
        .reduce((accum, include) => accum.concat(include.fragDeps), []));
    addToResolvedFragmentsSet(staleCat.callbacks
        .reduce((accum, callback) => accum.concat(callback.fragDeps), []));
    addToResolvedFragmentsSet(staleCat.modules
        .reduce((accum, module) => accum.concat(module.fragDeps), []));
    addToResolvedFragmentsSet(staleCat.data
        .reduce((accum, data) => accum.concat(data.fragDeps), []));

    const resolvedIncludesSet = new Set();

    // gather all the include dependencies into a set to dedupe
    const addToResolvedIncludesSet = addToSet(resolvedIncludesSet);

    addToResolvedIncludesSet(staleCat.includes
        .map(include => include.path));
    const includeDeps = Array.from(resolvedFragmentsSet)
        .reduce((accum, fragment) => accum
            .concat(getAllIncludeDepsFromResolvedFragment(fragment, pathsToAllTemplates,
                pathsToAllIncludes)), []);
    addToResolvedIncludesSet(includeDeps);

    // get list of deleted assets which can be used to clean up the public folder
    let pagesForGarbageCollection = [];

    if (process.env.TRIO_ENV_buildIncrementally === "incremental-build") {
        const cachedStatsFile = cachedStatsFileExists && getCachedStatsFile() || [];
        const currentStatsMap = new Map();
        stats.forEach(stat => currentStatsMap.set(stat.path, stat));
        const diffs = cachedStatsFile
            .filter(stat => stat.type !== "*" &&
                !currentStatsMap.has(stat.path));

        const cachedStatsMap = diffs && new Map();
        cachedStatsMap && cachedStatsFile
            .forEach(stat => cachedStatsMap.set(stat.path, stat));
        pagesForGarbageCollection = cachedStatsMap && cachedStatsMap.size > 0 &&
            diffs.reduce((accum, diff) => {
                if (diff.type === "fragment") {
                    accum.push(diff.destPath);
                } else {
                    cachedStatsMap
                        .get(diff.path).fragDeps
                        .forEach(diffStatFragDep =>
                            accum.push(cachedStatsMap.get(diffStatFragDep).destPath));
                }
                return accum;
            }, []) || [];
    }

    // return object containing stale pages, stats and resolved dependencies
    return {
        pagesForGarbageCollection,
        stats,
        resolvedDependencyPaths: {
            fragments: Array.from(resolvedFragmentsSet),
            includes: Array.from(resolvedIncludesSet)
        }
    };
};
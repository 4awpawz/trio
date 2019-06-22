/**
 * Resolves all stale assets to fragments using their dependency paths
 * and returns an object containing properties for stale pages, stats,
 * resolved dependencies and pages earmarked for deletion.
 */
const getStats = require("./getStats");
const groupStatsByCategory = require("./groupStatsByCategory");
const {
    doesCachedStatsFileExists,
    getCachedStatsFile,
    getFileModifiedTime
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

module.exports = assets => {
    const cachedStatsFileExists = doesCachedStatsFileExists();
    const timestampMs = cachedStatsFileExists && getFileModifiedTime(statsFileName) || 0;
    const stats = getStats(assets, timestampMs);
    const stale = process.env.TRIO_ENV_buildIncrementally === "no-incremental-build"
        ? stats
        : stats.filter(stat => stat.isStale);
    // log("stale count:", stale.length);

    // categorize stale stats by their type
    const getAllPathsByType = (stats => {
        return category => stats
            .filter(stat => stat.type === category)
            .map(stat => stat.path);
    })(stats);

    // paths to all fragments
    const pathsToAllFrags = getAllPathsByType("fragment");
    // paths to all templates
    const pathsToAllTemplates = getAllPathsByType("template");
    // paths to all includes
    const pathsToAllIncludes = getAllPathsByType("include");
    // paths to all callbacks
    const pathsToAllCallbacks = getAllPathsByType("callback");

    stale.filter(stat => stat.type === "template")
        .forEach(templateStat =>
            getTemplateDeps(templateStat, pathsToAllFrags));
    stale.filter(stat => stat.type === "include")
        .forEach(includeStat =>
            getIncludeDeps(includeStat, pathsToAllTemplates, pathsToAllFrags));
    stale.filter(stat => stat.type === "callback")
        .forEach(callbackStat =>
            getCallbackDeps(callbackStat, pathsToAllIncludes, pathsToAllTemplates, pathsToAllFrags));
    stale.filter(stat => stat.type === "module")
        .forEach(moduleStat =>
            getRequiredModuleDeps(moduleStat, pathsToAllCallbacks, pathsToAllIncludes, pathsToAllTemplates, pathsToAllFrags));
    stale.filter(stat => stat.type === "data")
        .forEach(dataStat =>
            getDataDeps(dataStat, pathsToAllCallbacks, pathsToAllIncludes, pathsToAllTemplates, pathsToAllFrags));

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

    // return object containing properties for stale pages, stats,
    // resolved dependencies and pages earmarked for garbage collection
    return {
        pagesForGarbageCollection,
        stats,
        stale,
        resolvedDependencies: {
            fragmentStats: stats.filter(stat => resolvedFragmentsSet.has(stat.path)),
            includeStats: stats.filter(stat => resolvedIncludesSet.has(stat.path))
        }
    };
};
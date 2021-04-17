"use strict";
/**
 * Resolves all stale assets to fragments and includes using their dependency paths.
 */

const groupStatsByCategory = require("./groupStatsByCategory");
const {
    getTemplateDeps,
    getIncludeDeps,
    getCallbackDeps,
    getRequiredModuleDeps,
    getDataDeps,
    getAllIncludeDepsFromResolvedFragment,
    getFilterDeps
} = require("./resolvers");

module.exports = (stats) => {
    const stale = process.env.TRIO_ENV_buildIncrementally === "no-incremental-build"
        ? stats
        : stats.filter(stat => stat.isStale);

    // categorize stats by their type
    const getAllPathsByType = (stats => {
        return type => stats
            .filter(stat => stat.type === type)
            .map(stat => stat.path);
    })(stats);

    // paths to all generators
    const pathsToAllGenerators = getAllPathsByType("generator");
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
            getTemplateDeps(templateStat, [...pathsToAllGenerators, ...pathsToAllFrags]));
    stale.filter(stat => stat.type === "include")
        .forEach(includeStat =>
            getIncludeDeps(includeStat, pathsToAllTemplates, [...pathsToAllGenerators, ...pathsToAllFrags]));
    stale.filter(stat => stat.type === "callback")
        .forEach(callbackStat =>
            getCallbackDeps(callbackStat, pathsToAllIncludes, pathsToAllTemplates,
                [...pathsToAllGenerators, ...pathsToAllFrags]));
    stale.filter(stat => stat.type === "module")
        .forEach(moduleStat =>
            getRequiredModuleDeps(moduleStat, pathsToAllCallbacks, pathsToAllIncludes, pathsToAllTemplates, [...pathsToAllGenerators, ...pathsToAllFrags]));
    stale.filter(stat => stat.type === "filter")
        .forEach(filterStat =>
            getFilterDeps(filterStat, pathsToAllGenerators));
    stale.filter(stat => stat.type === "data")
        .forEach(dataStat =>
            getDataDeps(dataStat, pathsToAllCallbacks, pathsToAllIncludes, pathsToAllTemplates,
                [...pathsToAllGenerators, ...pathsToAllFrags]));

    const staleCat = groupStatsByCategory(stale);

    // gather all the fragment dependencies into a set to dedupe
    const resolvedFragmentsSet = new Set();
    const addToResolvedFragmentsSet =
        (set => items => items.forEach(item => set.add(item)))(resolvedFragmentsSet);

    addToResolvedFragmentsSet(staleCat.generators
        .map(generator => generator.path));
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
    addToResolvedFragmentsSet(staleCat.filters
        .reduce((accum, filter) => accum.concat(filter.fragDeps), []));
    addToResolvedFragmentsSet(staleCat.data
        .reduce((accum, data) => accum.concat(data.fragDeps), []));

    // gather all the include dependencies into a set to dedupe
    const resolvedIncludesSet = new Set();
    const addToResolvedIncludesSet =
        (set => items => items.forEach(item => set.add(item)))(resolvedIncludesSet);

    addToResolvedIncludesSet(staleCat.includes
        .map(include => include.path));
    const includeDeps = Array.from(resolvedFragmentsSet)
        .reduce((accum, fragment) => accum
            .concat(getAllIncludeDepsFromResolvedFragment(fragment, pathsToAllTemplates,
                pathsToAllIncludes)), []);
    addToResolvedIncludesSet(includeDeps);

    // return object containing properties for resolved dependencies
    return {
        fragmentStats: stats.filter(stat => resolvedFragmentsSet.has(stat.path)),
        includeStats: stats.filter(stat => resolvedIncludesSet.has(stat.path))
    };
};
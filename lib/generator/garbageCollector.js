const { statsFileName } = require("../config/fileNames");
const { doesCachedStatsFileExists, readCache } = require("../utils");

module.exports = (currentStats) => {
    const cachedStatsFile = doesCachedStatsFileExists() &&
        readCache(statsFileName).filter(stat => stat.type === "fragment") || [];

    const currentStatsMap = new Map();
    currentStats.forEach(stat => currentStatsMap.set(stat.path, stat));

    const diffs = cachedStatsFile.filter(stat =>
        !(currentStatsMap.has(stat.path) &&
            currentStatsMap.get(stat.path).destPath === stat.destPath));

    const cachedStatsMap = diffs && new Map();
    cachedStatsMap && cachedStatsFile
        .forEach(stat => cachedStatsMap.set(stat.path, stat));

    const pagesForGarbageCollection = cachedStatsMap && cachedStatsMap.size > 0 &&
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
    return pagesForGarbageCollection;
};
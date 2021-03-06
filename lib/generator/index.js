const { existsSync } = require("fs-extra");
const { integrityCheck, resolveDependencies, fragmentFrontMatterCheck } = require("../buildanalyzer");
const config = require("../config");
const validatePermalinks = require("../config/validatePermalinks");
const { metaFileName, statsFileName } = require("../config/fileNames");
const getAssets = require("./getAssets");
const reportWips = require("./reportWips");
const reportMissingAssets = require("./reportMissingAssets");
const makePublicFolder = require("./makePublicFolder");
const mashup = require("./mashup");
const sassRender = require("./sassRender");
const cacheBust = require("./cacheBust");
const createManifest = require("./createManifest");
const createBlogMetadata = require("./blog");
const cleanPublic = require("./cleanPublic");
const copyOtherFiles = require("./copyOtherFiles");
const deleteReleaseFolder = require("./deleteReleaseFolder");
const garbageCollector = require("./garbageCollector");
const {
    getFragmentMetadata,
    getAllIncludesMetadata,
    getAllData
} = require("../metadata");
const {
    clearReadCache,
    clearMatterCache,
    doesCachedStatsFileExists,
    isPlural,
    log,
    readCache,
    triggerOneOffBuild,
    writeCachedStatsFile,
    writeCachedMetaFile
} = require("../utils");
const metrics = require("../metrics");
const getStats = require("../stats/getStats");
const collections = require("../collections");
const userConfig = require("../config/userConfig");

module.exports = async () => {
    metrics.clearTimers();
    metrics.startTimer("total elapsed time");

    // clear read caches
    clearReadCache();
    clearMatterCache();

    // get Trio's internal metadata
    const cacheMetadata = existsSync(metaFileName) &&
        readCache(metaFileName) || { lastTrioVersionUsed: "" };

    // trigger a one off build if Trio's version has changed
    cacheMetadata.lastTrioVersionUsed !== process.env.TRIO_ENV_version &&
        triggerOneOffBuild();

    config.userConfig = userConfig();

    const siteMetadata = {};
    siteMetadata.timestamp = new Date().toLocaleString();
    siteMetadata.version = process.env.TRIO_ENV_version;
    siteMetadata.buildType = process.env.TRIO_ENV_buildType;
    siteMetadata.userConfig = config.userConfig;
    siteMetadata.dataCatalog = getAllData();

    const publicFolderExists = existsSync(config.targetFolder);

    process.env.TRIO_ENV_buildType === "release" && deleteReleaseFolder();

    if (process.env.TRIO_ENV_buildType !== "release" &&
        process.env.TRIO_ENV_buildIncrementally ===
        "no-incremental-build" || !publicFolderExists) {
        makePublicFolder();
    }

    config.userConfig.baseUrl !== "" && log(`baseUrl is "${config.userConfig.baseUrl}"`);

    // get project assets, including wips
    metrics.startTimer("getting assets");
    const { assets, wips } = getAssets();
    siteMetadata.wipsCount = wips.length;
    siteMetadata.wips = wips;
    reportWips(wips);
    metrics.stopTimer("getting assets");

    // integrity check the project
    metrics.startTimer("checking project integrity");
    fragmentFrontMatterCheck(assets);
    const missingAssets = integrityCheck(assets);
    if (missingAssets && missingAssets.length > 0) {
        reportMissingAssets(missingAssets);
    }
    metrics.stopTimer("checking project integrity");

    // generate stats
    metrics.startTimer("generating stats");
    let stats = getStats(assets);
    metrics.stopTimer("generating stats");

    // resolve dependencies
    metrics.startTimer("resolving dependencies for stats");
    const resolvedDependencies = resolveDependencies(stats);
    metrics.stopTimer("resolving dependencies for stats");

    // generate metadata
    metrics.startTimer("generating metadata for stale stat fragments");
    getFragmentMetadata(resolvedDependencies.fragmentStats);
    metrics.stopTimer("generating metadata for stale stat fragments");

    // when building incrementally, we need to merge the old
    // stat file's content with the new stats
    metrics.startTimer("reconciling stats");
    if (process.env.TRIO_ENV_buildIncrementally === "incremental-build" && doesCachedStatsFileExists()) {
        const oldStats = doesCachedStatsFileExists() && readCache(statsFileName);
        const oldStatsMap = new Map(oldStats.map(oldStat => [oldStat.path, oldStat]));
        const newStatsMap = new Map(stats.map(stat => [stat.path, stat]));
        oldStatsMap.forEach((oldStat, oldStatPath) => {
            // generators should always be marked as "alwaysBuild" so there is no
            // need to carry over generated collection stats to the new stats file
            if (!oldStat.generator && existsSync(oldStatPath) && newStatsMap.get(oldStatPath).isStale === false) {
                oldStat.isStale = false;
                newStatsMap.set(oldStatPath, oldStat);
            }
        });
        stats = [...newStatsMap.values()];
    }
    // add all stat fragments to siteMetadata.frags
    siteMetadata.frags = stats.filter(stat => stat.type === "fragment" || stat.type === "generator");
    metrics.stopTimer("reconciling stats");

    metrics.startTimer("creating blog metadata");
    createBlogMetadata(siteMetadata);
    metrics.stopTimer("creating blog metadata");

    // create stats for collections
    metrics.startTimer("processing collections");
    const collectionFragments = collections(resolvedDependencies.fragmentStats
        .filter(stat => stat.type === "generator"), siteMetadata);
    collectionFragments && stats.push(...collectionFragments);
    collectionFragments && resolvedDependencies.fragmentStats.push(...collectionFragments);
    siteMetadata.frags.push(...collectionFragments);
    // remove all generators from the list of resolved fragments - they
    // have done their job and are not needed for page generation
    resolvedDependencies.fragmentStats = resolvedDependencies.fragmentStats.length > 0
        ? resolvedDependencies.fragmentStats
            .filter(resolvedFragment => resolvedFragment.type !== "generator")
        : resolvedDependencies.fragmentStats;
    const rfl = resolvedDependencies.fragmentStats.length;
    log(`generating: ${rfl} ${isPlural(rfl) ? "pages" : "page"}`);
    metrics.stopTimer("processing collections");

    // set default values if needed in siteMetadata
    siteMetadata.frags = siteMetadata.frags || [];
    siteMetadata.wipsCount = siteMetadata.wipsCount || 0;
    siteMetadata.wips = siteMetadata.wips || [];
    siteMetadata.articlesCount = siteMetadata.articlesCount || 0;
    siteMetadata.articlesCatalog = siteMetadata.articlesCatalog || [];
    siteMetadata.tagsCatalog = siteMetadata.tagsCatalog || [];
    siteMetadata.categoriesCatalog = siteMetadata.categoriesCatalog || [];

    // validate permalinks against the stats
    metrics.startTimer("validating permlinks");
    validatePermalinks(stats);
    metrics.stopTimer("validating permlinks");

    // generate pages from asset based metadata
    metrics.startTimer("composition");
    const includesMetadataMap = new Map();
    getAllIncludesMetadata(resolvedDependencies.includeStats)
        .forEach(imd => includesMetadataMap.set(imd.path, imd));
    if (resolvedDependencies.fragmentStats.length > 0) {
        const fragsMap = new Map();
        siteMetadata.frags.forEach(frag =>
            fragsMap.set(frag.path, frag));
        for (const fragmentStat of resolvedDependencies.fragmentStats) {
            await mashup(fragsMap.get(fragmentStat.path), includesMetadataMap, siteMetadata);
        }
    }
    metrics.stopTimer("composition");

    // create trio.manifest.json
    process.env.TRIO_ENV_buildType !== "release" &&
        createManifest(siteMetadata);

    // clean public folder
    if (process.env.TRIO_ENV_buildIncrementally === "incremental-build") {
        metrics.startTimer("cleaning public folder");
        const pagesForGarbageCollection = garbageCollector(siteMetadata.frags);
        cleanPublic(pagesForGarbageCollection);
        metrics.stopTimer("cleaning public folder");
    }

    copyOtherFiles();
    await sassRender();

    // do release processing if requested
    if (process.env.TRIO_ENV_buildType === "release") {
        if (process.env.TRIO_ENV_cacheBust === "cache-bust") {
            metrics.startTimer("cache busting");
            await cacheBust().catch();
            metrics.stopTimer("cache busting");
        }
    }

    // save current project stats to .cache
    process.env.TRIO_ENV_buildType !== "release" &&
        writeCachedStatsFile(stats);

    // save Trio's current internal metadata
    cacheMetadata.lastTrioVersionUsed = process.env.TRIO_ENV_version;
    writeCachedMetaFile(cacheMetadata);

    log(metrics.stopTimer("total elapsed time"));
    metrics.deleteTimer("total elapsed time");

    // print metrics
    process.env.TRIO_ENV_printMetrics === "print-metrics" && metrics.forEach(timer => log(timer.elapsed));
};
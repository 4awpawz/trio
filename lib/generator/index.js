const { existsSync } = require("fs-extra");
const { integrityCheck, resolveDependencies } = require("../buildanalyzer");
const config = require("../config");
const { statsFileName } = require("../config/fileNames");
const getAssets = require("./getAssets");
const reportWips = require("./reportWips");
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
    getAllMetadata,
    getAllIncludesMetadata,
    getAllData
} = require("../metadata");
const {
    clearCache,
    doesCachedStatsFileExists,
    log,
    readCache,
    writeCachedStatsFile
} = require("../utils");
const metrics = require("../metrics");

module.exports = async () => {
    metrics.startTimer("total elapsed time");
    clearCache();
    let siteMetadata = {};
    siteMetadata.timestamp = new Date().toLocaleString();
    siteMetadata.version = process.env.TRIO_ENV_version;
    siteMetadata.buildType = process.env.TRIO_ENV_buildType;
    siteMetadata.userConfig = config.userConfig;
    siteMetadata.dataCatalog = getAllData();

    const publicFolderExists = existsSync(config.public);

    process.env.TRIO_ENV_buildType === "release" && deleteReleaseFolder();

    if (process.env.TRIO_ENV_buildType !== "release" &&
        process.env.TRIO_ENV_buildIncrementally ===
        "no-incremental-build" || !publicFolderExists) {
        makePublicFolder();
    }

    log(`baseUrl is "${config.userConfig.baseUrl}"`);

    const { assets, wips, wipsCount } = getAssets();

    // report wips
    reportWips(wipsCount, wips, siteMetadata);

    // integrity check the project
    metrics.startTimer("integrity check");
    log("checking project integrity");
    const missingAssets = integrityCheck(assets);
    if (missingAssets && missingAssets.length > 0) {
        log("*Warning, the following referenced assets can't be found:");
        const maSet = new Set(missingAssets);
        const a = Array.from(maSet);
        a.forEach((missingAsset, i) => {
            log(`${i + 1}) ${missingAsset}`);
        });
    }
    metrics.stopTimer("integrity check");

    // get stats and resolve dependencies
    metrics.startTimer("dependency resolution");
    log("resolving dependencies");
    const {
        resolvedDependencies,
        stats } = resolveDependencies(assets);
    log(`total pages generating: ${resolvedDependencies.fragmentStats.length}`);
    metrics.stopTimer("dependency resolution");

    siteMetadata = {
        ...siteMetadata,
        ...getAllMetadata(resolvedDependencies.fragmentStats)
    };

    // console.log("**** **** siteMetadata #1:", siteMetadata.frags.filter(md => md.path === "source/fragments/blog/articles/2019-06-19-v1.0.0-rc.1.md"));

    // merge the old stat file's content with the newly generated
    // stats and add all newStat fragments to siteMetadata.frags
    let newStats = [];
    if (process.env.TRIO_ENV_buildIncrementally === "incremental-build" && doesCachedStatsFileExists()) {
        const oldStats = doesCachedStatsFileExists() && readCache(statsFileName);
        const oldStatsMap = new Map(oldStats.map(oldStat => [oldStat.path, oldStat]));
        const newStatsMap = new Map(stats.map(stat => [stat.path, stat]));
        oldStatsMap.forEach((oldStat, path) => {
            const oldFileExists = existsSync(path);
            if (oldFileExists && !newStatsMap.has(path) ||
                oldFileExists && newStatsMap.get(path).isStale === false) {
                oldStat.isStale = false;
                newStatsMap.set(path, oldStat);
            }
        });
        newStats = [...newStatsMap.values()];
        siteMetadata.frags = newStats.filter(newStat => newStat.type === "fragment");
    }

    // console.log("**** **** siteMetadata #2:", siteMetadata.frags.filter(md => md.path === "source/fragments/blog/articles/2019-06-19-v1.0.0-rc.1.md"));

    createBlogMetadata(siteMetadata);

    // console.log("**** **** siteMetadata #3:", siteMetadata.frags.filter(md => md.path === "source/fragments/blog/articles/2019-06-19-v1.0.0-rc.1.md"));
    // console.log("**** **** resolvedDependencies #1:", resolvedDependencies.fragmentStats.filter(md => md.path === "source/fragments/blog/articles/2019-06-19-v1.0.0-rc.1.md"));

    // generate pages from asset based metadata
    const includesMetadataMap = new Map();
    getAllIncludesMetadata(resolvedDependencies.includeStats)
        .forEach(imd =>
            includesMetadataMap.set(imd.path, imd));
    metrics.startTimer("composition");
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
        const pagesForGarbageCollection = garbageCollector(siteMetadata.frags);
        cleanPublic(pagesForGarbageCollection);
    }
    copyOtherFiles();
    await sassRender();

    // do release processing if requested
    if (process.env.TRIO_ENV_buildType === "release") {
        if (process.env.TRIO_ENV_cacheBust === "cache-bust") {
            await cacheBust().catch();
        }
    }

    // save current project stats to .cache
    process.env.TRIO_ENV_buildType !== "release" &&
        writeCachedStatsFile(newStats.length > 0 && newStats || stats);
    metrics.stopTimer("total elapsed time");
    metrics.forEach(timer => log(timer.elapsed));
};
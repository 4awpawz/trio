// Items to be addressed:
// ToDo: rename callback arguements: siteMetadata to site and $ to $page.
// ToDo: get rid of id: it can't be consistent accross incremental builds and url can be used in its place as can any item that is unique. Also, note its removal in the documentation and release notes.
// ToDo: refactor trio.manifest.json.
// ToDo: provide option to create scaffolding application when creating a new project.
// ToDo: provide options to create assets: template, fragment, include, callback?

// Items that may or may not be addressed:
// ToDo: make missing assets terminate process an option - currently warning?
// Bug: rename config.public (i.e. public is a reserved word) to config.publicFolder?
// ToDo: is assigning modified date to each asset still required as the modified date from .cache/stats.json is being used and not the individual files?
// ToDo: add the ability to pass data from a tag to a tag-based callbacks using data-trio-value="{\"someValue": somevalue}\"" added to the ctx as value?
// ToDo: lock down all the meta data so that it can't be modified by callbacks?
// ToDo: add sortedTagCatalogFlattened to metadata?
// ToDo: require-uncached has been deprecated in favor of import-fresh - upgrade when convenient???

// Items Addressed:
// ToDo: see issue #75 regarding showing the name of the callback when it throws an exception!
// Bug: see issue #74 regarding garbage collection and blog article pages!
// Bug: see issue #73 regarding callbacks declared with .js file extensions causing dependency resolution to fail!
// Bug: file names without extensions are ignored when copying files from etc folder!
// ToDo: for release builds, delete the release folder if it exists first!
// ToDo: document the new predefined front matter alwaysBuild property!
// ToDo: document the front matter properties used in tag-based JavaScript callbacks!
// ToDo: add the ability to mark an asset so that it is always rebuilt!
// ToDo: develop a timing subsystem that can be triggered via a command line option and writes timing metrics to a log file that can be used to communicate responsiveness issues!
// ToDo: formalize informative, error message loging!
// ToDo: when releasing, generate the site in a folder named config.baseUrl!
// ToDo: refactor the code that determines data dependencies to work just like how module dependencies are determined - using front matter in the tag-based JavaScript callback itself. This would eliminate the need for the data-trio-data tag!
// ToDo: update to Node v10 LTS!
// ToDo: Bug - assets marked as wips breaks releasee build - refactor how wips are handled!
// ToDo: when releasing, don't save stats.json & trio.manifest.json files!
// ToDo: when globing, ignore mac system file .DS_Store!
// ToDo: rename sortedTagCatalog to tagsCatalog!
// ToDo: remove utils/callCallback.js, mashupInclude.js from project!
// ToDo: rename config mdFrontMatterDelimeters to frontMatterDelimeters, mdFrontMatterSeparator to frontMatterSeparator!
// ToDo: add the ability for templates to have callbacks and resolve their callback dependencies!
// ToDo: remove nojekyll!
// ToDo: optimize incremental build!
// ToDo: allow any fragment, not just blog fragments, to be marked as wip!
// Bug: 1st time building project using -i generates bad stale count!
// ToDo: in cli help for build, indicate that serve is only valid when used along with watch!
// ToDo: resolve where callback data dependency should be declared, add a new data-trio-data attribute for that or in the data-trio-callback itself such as data-trio-callback="abc, [data[,data]]"!
// ToDo: only support data dependency declarations via tag based callbacks and remove support for declaring data dependencies in gray matter!
// ToDo: once data is resolved remove data from front matter!
// ToDo: implement missing integrity check and resolvers for tag callbacks and remove those related to gray matter callback declarations!
// ToDo: only support the new tag based callback mechanism and remove support for the older gray matter callback declarations!
// ToDo: implement cleaning public folder based on source/etc's content before copying files from source/etc!
// ToDo: add missing command specific help info in cli!
// ToDo: remove callback from the ctx created in callTagCallbacks.js!
// When cleaning public folder, all assets there should be viable targets i.e. media files, scripts, etc!
// Bug: environment version doesn't seem to get set when running incremental build - the problem is that  a change in package.json's version doesn't trigger a build which could be resolved if versiion were treated just like any other user project asset OR you include a warning in the documentation that if user is relying on the version then they should do a non incremental build after installing a new version of Trio!
// ToDo: add Trio version to siteMetadata & trio.manifest.json!
// ToDo: move stale source/media, source/etc files, source/css files to public when building incrementally!
// ToDo: HTML tag-specific callbacks in lieu of/in addition to fragment/include callbacks - e.g. <ul> data-trio-callback="somecallback"</ul>!
// Bug: trio crashes if trio.json is empty file - modify create new file to write an empty object to the file!
// ToDo: add serve option to build and single purpose serve to just running the app in the browser without build and file watcher (i.e. used to demo public). In addition make cache busting optional in release!
// ToDo: comment out cache busting until a solution is found for integrating it back into the new build process!
// Bug: cli breaks when multiple options are provided (e.g. -i -w) but works when provided in multiples (e.g. -iw)!
// Bug: glob patterns must always use forward slashses only as back slashes are interpreted as escape character!
// ToDo: clean public folder!
// Bug: runing serve always builds & negates baseUrl because it doesn't check for last build type). Always apply baseUrl when building or serving!
// Bug: cli crashes because it is requiring modules that requires config that requires trio.json!
// ToDo: integrate read cache into the rest of the app!
// ToDo: integrate read cached matter into the rest of the app!
// ToDo: all paths passed to readCache must be relative with source as its base - use join if not so!
// ToDo: reduce the # of try/catch blocks where feasable!
// ToDo: don't hard code version - get it directly from package.json!

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
        log("warning: the following referenced assets can't be found:");
        const maSet = new Set(missingAssets);
        maSet.forEach(path => log(` ${path}`));
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
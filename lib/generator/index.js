// ToDo: eliminate release & add its procssing to both build & serve as options
// ToDo: add --ignore-initial to build when run with -w -- just watch but don't build 1st time in
// ToDo: add --ignore-initial to serve -- just watch but don't build 1st time in
// ToDo: formalize informative, error message loging
// ToDo: develop a timing subsystem that can be triggered via a command line option?
// ToDo: add remaining assets to incremental build (e.g. sass, )?

// Bug: runing serve always builds & negates baseUrl because it doesn't check for last build type). Always apply baseUrl when building!
// Bug: cli crashes because it is requiring modules that requires config that requires trio.json!
// ToDo: integrate read cache into the rest of the app!
// ToDo: integrate read cached matter into the rest of the app!
// ToDo: all paths passed to readCache must be relative with source as its base - use join if not so!
// ToDo: reduce the # of try/catch blocks where feasable!
// ToDo: don't hard code version - get it directly from package.json!

// ToDo: configure BrowseerSync to use a virtual path prefix so that always generating with baseUrl will work when serving the site - see https://expressjs.com/en/starter/static-files.html for infoX

const { existsSync } = require("fs-extra");
const { integrityCheck, resolveDependencies } = require("../buildanalyzer");
const config = require("../config");
const makePublicFolder = require("./makePublicFolder");
const mashup = require("./mashup");
const mashupInclude = require("./mashupInclude");
const sassRender = require("./sassRender");
const cacheBust = require("./cacheBust");
const createManifest = require("./createManifest");
const createBlogMetadata = require("./blog");
const createNoJekyllFile = require("./createNoJekyllFile");
const etc = require("./etc");
const {
    getAllMetadata,
    getAllIncludesMetadata,
    getAllData

} = require("../metadata");
const { clearCache, log, writeCachedStatsFile } = require("../utils");

module.exports = async () => {
    console.time("generate");
    clearCache();
    let siteMetadata = {};
    siteMetadata.timestamp = new Date().toLocaleString();
    siteMetadata.buildType = process.env.TRIO_ENV_buildType;
    siteMetadata.userConfig = config.userConfig;
    siteMetadata.dataCatalog = getAllData();

    const publicFolderExists = existsSync(config.public);

    if (process.env.TRIO_ENV_buildIncrementally ===
        "no-incremental-build" || !publicFolderExists) {
        log("creating public folder");
        makePublicFolder();
    }

    // if (process.env.TRIO_ENV_buildType === "release") {
    //     log(`baseUrl is "${config.userConfig.baseUrl}"`);
    // }
    log(`baseUrl is "${config.userConfig.baseUrl}"`);

    // integrity check the project
    log("checking project integrity");
    console.time("integrity check");
    const missingAssets = integrityCheck();
    if (missingAssets && missingAssets.length > 0) {
        log("error: processing has terminated becasue the following referenced assets can't be found.");
        const maSet = new Set(missingAssets);
        maSet.forEach(path => log(` ${path}`));
        process.exit();
    }
    console.timeEnd("integrity check");

    // get stats and resolve dependencies
    log("resolving dependencies");
    console.time("build analyzer");
    const { resolvedDependencyPaths, stats } = resolveDependencies();
    log(`${resolvedDependencyPaths.fragments.length} pages affected by stale`);
    // log(`${stalePages.length} pages to be removed from public:`);
    console.timeEnd("build analyzer");

    const fragsStatsMap = new Map();
    stats
        .forEach(stat => stat.type === "fragment" && fragsStatsMap.set(stat.path, stat));

    // generate asset based metadata
    siteMetadata = {
        ...siteMetadata,
        ...getAllMetadata(fragsStatsMap)
    };

    createBlogMetadata(siteMetadata);

    // generate pages from asset based metadata

    const includesMetadata = getAllIncludesMetadata();
    // ?
    const includesFilter =
        resolvedDependencyPaths.includes.length > 0
            ? includesMetadata.filter(imd =>
                resolvedDependencyPaths.includes
                    .some(rdi => rdi === imd.path))
            : (!publicFolderExists ||
                process.env.TRIO_ENV_buildIncrementally === "no-incremental-build") &&
            includesMetadata;
    if (includesFilter.length > 0) {
        for (const includeMetadata of includesFilter) {
            await mashupInclude(includeMetadata, siteMetadata);
        }
    }

    // ?
    const fragmentsFilter =
        resolvedDependencyPaths.fragments.length > 0
            ? siteMetadata.frags.filter(fmd =>
                resolvedDependencyPaths.fragments
                    .some(rdf => rdf === fmd.path))
            : (!publicFolderExists ||
                process.env.TRIO_ENV_buildIncrementally === "no-incremental-build") &&
            siteMetadata.frags;
    if (fragmentsFilter.length > 0) {
        for (let i = 0; i < fragmentsFilter.length; i++) {
            await mashup(fragmentsFilter[i], includesFilter, siteMetadata, i === 0);
        }
    }

    createManifest(siteMetadata);
    await sassRender();
    etc();

    if (process.env.TRIO_ENV_buildType === "release") {
        await cacheBust().catch();
        if (config.userConfig.nojekyll) {
            createNoJekyllFile();
        }
    }

    // // clean public folder
    // stalePages.length > 0 && stalePages.forEach(stalePage => cleanPublic(stalePage));

    writeCachedStatsFile(stats);
    console.timeEnd("generate");
};
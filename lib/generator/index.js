// ToDo: is assigning modified date to each asset still required as the modified date from .cache/stats.json is being used and not the individual files?
// ToDo: once data is resolved remove data from front matter.
// ToDo: resolve where callback data dependency should be declared, add a new data-trio-data attribute for that or in the data-trio-callback itself such as data-trio-callback="abc, [data[,data]]".
// ToDo: when documenting tag based callbacks mention that callbacks are only allowed in includes and fragments.
// ToDo: add baseUrl as a command option to build and release?
// ToDo: only support data dependency declarations via tag based callbacks and remove support for declaring data dependencies in gray matter.
// ToDo: when documenting release with cache busting point out that running an incremental build immediately after could leave the project in a broken state (i.e. src & hrefs could be broken) and that a full build of the project should be done instead.
// Bug: rename config.public (i.e. public is a reserved word) to config.publicFolder
// ToDo: formalize informative, error message loging
// ToDo: develop a timing subsystem that can be triggered via a command line option and writes timing telemetrics to a log file that can be used by a user to communicate responsiveness issues

// ToDo: add remaining assets to incremental build (e.g. sass, media ) - these are those whose type is "*" and should only need to be moved from their source folder to their corresponding folder in public???

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

// ToDo: eliminate the use of data-trio-linkx

const { existsSync } = require("fs-extra");
const { integrityCheck, resolveDependencies } = require("../buildanalyzer");
const config = require("../config");
const makePublicFolder = require("./makePublicFolder");
const mashup = require("./mashup");
// const mashupInclude = require("./mashupInclude");
const sassRender = require("./sassRender");
const cacheBust = require("./cacheBust");
const createManifest = require("./createManifest");
const createBlogMetadata = require("./blog");
const createNoJekyllFile = require("./createNoJekyllFile");
const cleanPublic = require("./cleanPublic");
const copyOtherFiles = require("./copyOtherFiles");
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
    siteMetadata.version = process.env.TRIO_ENV_version;
    siteMetadata.buildType = process.env.TRIO_ENV_buildType;
    siteMetadata.userConfig = config.userConfig;
    siteMetadata.dataCatalog = getAllData();

    const publicFolderExists = existsSync(config.public);

    if (process.env.TRIO_ENV_buildIncrementally ===
        "no-incremental-build" || !publicFolderExists) {
        log("creating public folder");
        makePublicFolder();
    }

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
    const {
        resolvedDependencyPaths,
        stats,
        pagesForGarbageCollection } = resolveDependencies();
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

    const includesMetadataMap = new Map();
    getAllIncludesMetadata().forEach(imd => includesMetadataMap.set(imd.path, imd));
    // ?
    // const includesFilter =
    //     resolvedDependencyPaths.includes.length > 0
    //         ? includesMetadata.filter(imd =>
    //             resolvedDependencyPaths.includes
    //                 .some(rdi => rdi === imd.path))
    //         : (!publicFolderExists ||
    //             process.env.TRIO_ENV_buildIncrementally === "no-incremental-build") &&
    //         includesMetadata;
    // if (includesFilter.length > 0) {
    //     for (const includeMetadata of includesFilter) {
    //         await mashupInclude(includeMetadata, siteMetadata);
    //     }
    // }

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
            // await mashup(fragmentsFilter[i], includesFilter, siteMetadata);
            await mashup(fragmentsFilter[i], includesMetadataMap, siteMetadata);
        }
    }

    createManifest(siteMetadata);
    // clean public folder
    process.env.TRIO_ENV_buildIncrementally === "incremental-build" &&
        pagesForGarbageCollection.length > 0 &&
        cleanPublic(pagesForGarbageCollection);
    copyOtherFiles();
    await sassRender();

    if (process.env.TRIO_ENV_buildType === "release") {
        if (process.env.TRIO_ENV_cacheBust === "cache-bust") {
            await cacheBust().catch();
        }
        if (config.userConfig.nojekyll) {
            createNoJekyllFile();
        }
    }

    writeCachedStatsFile(stats);
    console.timeEnd("generate");
};
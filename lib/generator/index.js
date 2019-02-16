// ToDo: integrate read cache into the rest of the app
// ToDo: integrate read cached matter into the rest of the app
// ToDo: formalize error message loging
// ToDo: develop a timing subsystem that can be triggered via a command line option
// ToDo: add remaining assets to incremental build (e.g. sass, )?
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
const { log, writeCachedStatsFile } = require("../utils");

module.exports = async () => {
    console.time("generate");
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

    if (process.env.TRIO_ENV_buildType === "release") {
        log(`baseUrl is "${config.userConfig.baseUrl}"`);
    }

    // integrity check the project
    log("checking project integrity");
    console.time("integrity check");
    const missingAssets = integrityCheck();
    if (missingAssets && missingAssets.length > 0) {
        console.log("error: processing has terminated becasue the following referenced assets can't be found.");
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
        .filter(stat => stat.type === "fragment")
        .forEach(fragStat => fragsStatsMap.set(fragStat.path, fragStat));

    // generate asset based metadata
    siteMetadata = {
        ...siteMetadata,
        ...getAllMetadata(fragsStatsMap)
    };

    createBlogMetadata(siteMetadata);

    // generate pages from asset based metadata

    const includesMetadata = getAllIncludesMetadata();
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
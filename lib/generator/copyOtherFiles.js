const { join, parse } = require("path");
const fs = require("fs-extra");
const config = require("../config");
const {
    doesCachedStatsFileExists,
    getCachedStatsFile,
    globFriendly,
    log } = require("../utils");

const deleteFiles = paths => paths.forEach(path => {
    fs.existsSync(path) && fs.unlinkSync(path);
});

const getEtcs = () =>
    doesCachedStatsFileExists() && getCachedStatsFile()
        .filter(stat => stat.path.startsWith(config.sourceEtc))
        .map(etc => join(config.public, parse(etc.path).base));

module.exports = () => {
    try {
        // copy source/etc/*.* to public/
        if (process.env.TRIO_ENV_buildIncrementally === "incremental-build") {
            const oldEtcs = getEtcs(); 
            oldEtcs && oldEtcs.length > 0 && deleteFiles(oldEtcs);
        }
        globFriendly(join(config.sourceEtc, "*.*"), {
            dot: true
        }).forEach(path => {
            const outFilePath = join(config.publicEtc, parse(path).base);
            fs.copyFileSync(path, outFilePath);
        });

        // copy source/css to public/css
        deleteFiles(globFriendly(join(config.publicCss, "*.*")));
        fs.copySync(config.sourceCss, config.publicCss);

        // copy source/scripts to public/scripts
        deleteFiles(globFriendly(join(config.publicScripts, "*.*")));
        fs.copySync(config.sourceScripts, config.publicScripts);

        // copy source/media to public/media
        deleteFiles(globFriendly(join(config.publicMedia, "*.*")));
        fs.copySync(config.sourceMedia, config.publicMedia);
    } catch (error) {
        log(error);
    }
};
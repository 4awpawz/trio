"use strict";
const fs = require("fs-extra");
const config = require("../config");
const { log } = require("../utils");

module.exports = () => {
    try {
        // copy source/etc to public
        fs.pathExistsSync(config.sourceEtc) && fs.copySync(config.sourceEtc, config.publicEtc);

        // copy source/css to public/css
        fs.pathExistsSync(config.sourceCss) && fs.copySync(config.sourceCss, config.publicCss);

        // copy source/scripts to public/scripts
        fs.pathExistsSync(config.sourceScripts) && fs.copySync(config.sourceScripts, config.publicScripts);

        // copy source/media to public/media
        fs.pathExistsSync(config.sourceMedia) && fs.copySync(config.sourceMedia, config.publicMedia);
    } catch (error) {
        log(error);
    }
};
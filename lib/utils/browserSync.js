"use strict";
const { sep } = require("path");
const bsf = require("browser-sync");
const { findAPortNotInUse } = require("portscanner");
const { targetFolder } = require("../config");

module.exports = async () => {
    const bs = bsf.create();
    const baseUrl = process.env.TRIO_ENV_baseUrl;

    bs.watch(`.${sep}${targetFolder}${sep}**${sep}*.html`, (event, file) => {
        bs.reload(file);
    });
    bs.watch(`.${sep}${targetFolder}${sep}scripts${sep}**${sep}*.js`, (event, file) => {
        bs.reload(file);
    });
    bs.watch(`.${sep}${targetFolder}${sep}css${sep}**${sep}*.css`, (event, file) => {
        bs.reload(file);
    });
    bs.watch(`.${sep}${targetFolder}${sep}media${sep}**${sep}*.*`, (event, file) => {
        bs.reload(file);
    });

    bs.init({
        server: {
            baseDir: `.${sep}${targetFolder}`,
            middleware: (req, res, next) => {
                if (baseUrl && baseUrl.length > 0) {
                    const url = req.url.slice(baseUrl.length);
                    req.url = url.length === 0 ? sep : url;
                }
                return next();
            }
        },
        notify: false,
        port: await findAPortNotInUse(3000)
    });
};
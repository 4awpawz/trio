"use strict";
const { sep } = require("path");
const bs = require("browser-sync").create();
const { targetFolder } = require("../config");
// const log = require("./log");

module.exports = () => {
    const baseUrl = process.env.TRIO_ENV_baseUrl;

    bs.watch(`.${sep}${targetFolder}${sep}**${sep}*.*`, (event, file) => {
        bs.reload(file);
    });

    // bs.watch(`.${sep}${targetFolder}${sep}**${sep}*.html`, (event, file) => {
    //     bs.reload(file);
    // });

    // // Injections

    // bs.watch(`.${sep}${targetFolder}${sep}**${sep}*.css`, (event, file) => {
    //     event === "change" && bs.reload(file);
    // });

    // bs.watch(`.${sep}${targetFolder}${sep}**${sep}*.js`, (event, file) => {
    //     event === "change" && bs.reload(file);
    // });

    bs.init({
        server: {
            baseDir: `.${sep}${targetFolder}`,
            serveStaticOptions: {
                extensions: ["html"]
            },
            middleware: (req, res, next) => {
                if (baseUrl && baseUrl.length > 0) {
                    const url = req.url.slice(baseUrl.length);
                    req.url = url.length === 0 ? sep : url;
                }
                return next();
            }
        },
        notify: false
    });

    return bs;
};
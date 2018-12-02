const { sep } = require("path");
const bs = require("browser-sync").create();
const config = require("../config");

module.exports = () => {
    const buildType = process.env.TRIO_ENV_buildType;
    const baseUrl = process.env.TRIO_ENV_baseUrl;

    // Now init the Browsersync server
    bs.init({
        server: {
            baseDir: `.${sep}${config.public}`,
            serveStaticOptions: {
                extensions: ["html"]
            },
            middleware: (req, res, next) => {
                if (buildType === "release" && baseUrl && req.url.startsWith(baseUrl)) {
                    // serve release build without having to change the baseDir
                    req.url = req.url.slice(baseUrl.length);
                    req.url = req.url.length === 0 ? sep : req.url;
                }
                return next();
            }
        },
        notify: false
    });

    return bs;
};
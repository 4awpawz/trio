const { sep } = require("path");
const bs = require("browser-sync").create();
const { targetFolder } = require("../config");

module.exports = () => {
    const baseUrl = process.env.TRIO_ENV_baseUrl;

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
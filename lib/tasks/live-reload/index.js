const config = require("../../config");
const { sep } = require("path");
const bs = require("browser-sync").create();

module.exports = () => {
    // Listen to change events on HTML and reload
    bs.watch(`${config.public}${sep}**${sep}*.html`).on("change", bs.reload);

    // Provide a callback to capture ALL events to CSS
    // files - then filter for 'change' and reload all
    // css files on the page.
    bs.watch(`${config.publicCss}${sep}*.css`);

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
                    console.log("req.url", req.url);
                    // serve release build without having to change the baseDir
                    req.url = req.url.slice(baseUrl.length);
                    req.url = req.url.length === 0 ? sep : req.url;
                }
                return next();
            }
        },
        notify: false
    });
};
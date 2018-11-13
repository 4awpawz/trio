const bs = require("browser-sync").create();

module.exports = () => {
    // Listen to change events on HTML and reload
    bs.watch("public/**/*.html").on("change", bs.reload);

    // Provide a callback to capture ALL events to CSS
    // files - then filter for 'change' and reload all
    // css files on the page.
    bs.watch("public/css/*.css", function (event, file) {
        if (event === "change") {
            bs.reload("*.css");
        }
    });

    const baseUrl = process.env.TRIO_ENV_baseUrl;

    // Now init the Browsersync server
    bs.init({
        server: {
            baseDir: "./public",
            serveStaticOptions: {
                extensions: ["html"]
            },
            middleware: (req, res, next) => {
                if (baseUrl && req.url.startsWith(baseUrl)) {
                    // serve release build without having to change the baseDir
                    req.url = req.url.slice(baseUrl.length);
                }
                return next();
            }
        },
        notify: false
    });
};
const sass = require("node-sass");
const { sep, parse } = require("path");
const { writeFileSync } = require("fs-extra");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const config = require("../config");
const glob = require("glob");

module.exports = async () => {
    const mainSassFile = glob.sync("source/sass/{*.scss,*.sass}", {
        ignore: "source/sass/_*.*"
    })[0];
    if (mainSassFile) {
        const sassOutputFileName = `${parse(mainSassFile).name}.css`;
        const sassMapFileName = `${parse(mainSassFile).name}-map.css.map`;
        const sassConfig = {
            file: mainSassFile,
            outFile: `..${sep}..${sep}${config.publicCss}${sep}${sassOutputFileName}`
        };
        if (process.env.TRIO_ENV_buildType !== "release") {
            sassConfig.sourceMap = `..${sep}..${sep}${config.publicCss}${sep}${sassMapFileName}`;
            sassConfig.sourceMapContents = true;
        }
        const sassResult = sass.renderSync(sassConfig);
        const postcssConfig = process.env.TRIO_ENV_buildType !== "release"
            ? { from: `${parse(mainSassFile).name}-map.css`, map: { inline: false } }
            : { from: undefined };
        const apResult = await postcss([autoprefixer]).process(sassResult.css, postcssConfig);
        apResult.warnings().forEach(function (warn) {
            console.warn(warn.toString());
        });
        writeFileSync(`${config.publicCss}${sep}${sassOutputFileName}`, apResult.css);
        if (process.env.TRIO_ENV_buildType !== "release") {
            writeFileSync(`${config.publicCss}${sep}${sassMapFileName}`, sassResult.map);
        }
    }
};

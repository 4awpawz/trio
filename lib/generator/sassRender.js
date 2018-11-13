const sass = require("node-sass");
const { sep, parse } = require("path");
const { writeFileSync } = require("fs-extra");
const config = require("../config");
const glob = require("glob");

module.exports = () => {
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
        const result = sass.renderSync(sassConfig);
        writeFileSync(`${config.publicCss}${sep}${sassOutputFileName}`, result.css);
        if (process.env.TRIO_ENV_buildType !== "release") {
            writeFileSync(`${config.publicCss}${sep}${sassMapFileName}`, result.map);
        }
    }
};

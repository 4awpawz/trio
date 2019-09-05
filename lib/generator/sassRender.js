const sass = require("node-sass");
const { sep, parse } = require("path");
const { writeFileSync } = require("fs-extra");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano")({ preset: "cssnano-preset-default" });
const config = require("../config");
const { globFriendly, warn } = require("../utils");

module.exports = async () => {
    const mainSassFile = globFriendly("source/sass/{*.scss,*.sass}", {
        ignore: "source/sass/_*.*"
    })[0];
    if (mainSassFile) {
        const sassOutputFileName = `${parse(mainSassFile).name}.css`;
        const sassMapFileName = `${parse(mainSassFile).name}-map.css.map`;
        const sassConfig = {
            file: mainSassFile,
            outFile: `..${sep}..${sep}${config.publicCss}${sep}${sassOutputFileName}`
        };
        const postcssPlugins = process.env.TRIO_ENV_buildType !== "release"
            ? [autoprefixer]
            : [autoprefixer, cssnano];
        if (process.env.TRIO_ENV_buildType !== "release") {
            sassConfig.sourceMap = `..${sep}..${sep}${config.publicCss}${sep}${sassMapFileName}`;
            sassConfig.sourceMapContents = true;
        }
        const sassResult = sass.renderSync(sassConfig);
        const postcssConfig = process.env.TRIO_ENV_buildType !== "release"
            ? { from: `${parse(mainSassFile).name}-map.css`, map: { inline: false } }
            : { from: undefined };
        const postcssResult = await postcss(postcssPlugins).process(sassResult.css, postcssConfig);
        postcssResult.warnings().forEach(warning => warn(warning.toString()));
        writeFileSync(`${config.publicCss}${sep}${sassOutputFileName}`, postcssResult.css);
        if (process.env.TRIO_ENV_buildType !== "release") {
            writeFileSync(`${config.publicCss}${sep}${sassMapFileName}`, sassResult.map);
        }
    }
};

const sass = require("sass");
const { join, parse } = require("path");
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
        const sassOutputFileName = join(config.publicCss, `${parse(mainSassFile).name}.css`);
        const sassMapFileName = join(config.publicCss, `${parse(mainSassFile).name}.css.map`);
        const sassConfig = {
            file: mainSassFile,
            outFile: sassOutputFileName,
            sourceMap: true
        };
        const postcssPlugins = process.env.TRIO_ENV_buildType !== "release"
            ? [autoprefixer]
            : [autoprefixer, cssnano];
        if (process.env.TRIO_ENV_buildType !== "release") {
            sassConfig.sourceMap = sassMapFileName;
            sassConfig.sourceMapContents = true;
        }
        const sassResult = sass.renderSync(sassConfig);
        const postcssConfig = process.env.TRIO_ENV_buildType !== "release"
            // Note to self: your must use "prev:" and set it to the map produced by node-sass otherwise it won't work!
            ? { from: sassOutputFileName, to: sassOutputFileName, map: { prev: sassResult.map.toString(), inline: false } }
            : { from: undefined };
        const postcssResult = await postcss(postcssPlugins).process(sassResult.css.toString(), postcssConfig);
        postcssResult.warnings().forEach(warning => warn(warning.toString()));
        if (process.env.TRIO_ENV_buildType !== "release") {
            writeFileSync(sassMapFileName, postcssResult.map);
        }
        writeFileSync(sassOutputFileName, postcssResult.css);
    }
};

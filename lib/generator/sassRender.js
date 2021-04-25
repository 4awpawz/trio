"use strict";
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
        const generateSourceMap = process.env.TRIO_ENV_buildType === "release" &&
            config.userConfig.sassSourceMaps.release || config.userConfig.sassSourceMaps.development;
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
        sassConfig.sourceMapContents = generateSourceMap && true;
        const sassResult = sass.renderSync(sassConfig);
        const postcssConfig = generateSourceMap
            // Note to self: your must use "prev:" and set it to the map produced by node-sass otherwise it won't work!
            ? { from: sassOutputFileName, to: sassOutputFileName, map: { prev: sassResult.map.toString(), inline: false } }
            : { from: undefined };
        const postcssResult = await postcss(postcssPlugins).process(sassResult.css.toString(), postcssConfig);
        postcssResult.warnings().forEach(warning => warn(warning.toString()));
        const cssOutput = generateSourceMap && process.env.TRIO_ENV_buildType === "release" &&
                postcssResult.css.replace(`/*# sourceMappingURL=${parse(mainSassFile).name}.css.map */`,
                    `/*# sourceMappingURL=/css/${parse(mainSassFile).name}.css.map */`) ||
                postcssResult.css;
        generateSourceMap && writeFileSync(sassMapFileName, postcssResult.map);
        writeFileSync(sassOutputFileName, cssOutput);
    }
};

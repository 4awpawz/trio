const sass = require("node-sass");
const { sep } = require("path");
const { writeFileSync } = require("fs-extra");
const config = require("../config");

module.exports = () => {
    const devConfig = {
        file: `${config.sass}${sep}${config.sassFileName}`,
        outFile: `..${sep}..${sep}${config.publicCss}${sep}${config.sassOutputFileName}`,
        sourceMap: `..${sep}..${sep}${config.publicCss}${sep}${config.sassMapFileName}`,
        sourceMapContents: true
    };
    const releaseConfig = {
        file: `${config.sass}${sep}${config.sassFileName}`,
        outFile: `..${sep}..${sep}${config.publicCss}${sep}${config.sassOutputFileName}`
    };
    const result = sass.renderSync(process.env.TRIO_ENV === "release" && releaseConfig || devConfig);
    writeFileSync(`${config.publicCss}${sep}${config.sassOutputFileName}`, result.css);
    if (process.env.TRIO_ENV !== "release") {
        writeFileSync(`${config.publicCss}${sep}${config.sassMapFileName}`, result.map);
    }
};

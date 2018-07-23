const {
    ensureDirSync,
    removeSync,
    copySync
} = require("fs-extra");

const config = require("../config");

module.exports = () => {
    removeSync(`${config.public}`);
    ensureDirSync(`${config.publicCss}`);
    ensureDirSync(`${config.publicMedia}`);
    ensureDirSync(`${config.publicBlog}`);
    copySync(`${config.sourceCss}`, `${config.publicCss}`);
    copySync(`${config.sourceMedia}`, `${config.publicMedia}`);
};

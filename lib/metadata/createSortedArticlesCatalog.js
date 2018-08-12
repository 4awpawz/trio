const { sep } = require("path");
const config = require("../config");
// const normalizeArticleFileName = require("../utils/normalizeArticleFileName");

// 2018-01-01-name.ext -> 20180101
const convertFilePathToDate = filePath => {
    const i = filePath.search(/\d{4}-\d{2}-\d{2}/);
    if (!i) {
        throw new Error(`error: invalid article file name ${filePath}`);
    }
    return parseInt(filePath.substring(i, i + 10).split("-").join(""));
};

const sort = (a, b) => {
    const n1 = convertFilePathToDate(a.path);
    const n2 = convertFilePathToDate(b.path);
    return n2 - n1;
};

module.exports = frags => {
    const articles =
        frags.filter(frag => frag.path.startsWith(`${config.sourceArticles}`) &&
            frag.path !== `${config.sourceArticles}${sep}index.html`);
    articles.sort(sort);
    return articles;
};
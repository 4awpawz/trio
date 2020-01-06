const { sep } = require("path");
const config = require("../config");

// 2018-01-01-name.ext -> 20180101
const convertFilePathToDate = filePath => {
    const i = filePath.search(/\d{4}-\d{2}-\d{2}/);
    if (!i) {
        throw new Error(`Error: Invalid article file name ${filePath}`);
    }
    return parseInt(filePath.substring(i, i + 10).split("-").join(""), 10);
};

const sort = (a, b) => {
    const n1 = convertFilePathToDate(a.path);
    const n2 = convertFilePathToDate(b.path);
    const result = n2 - n1;
    return result !== 0
        ? result : a.matter.data.title === b.matter.data.title
            ? 0 : a.matter.data.title < b.matter.data.title
                ? -1 : 1;
};

const linkArticles = articles => {
    articles.forEach((article, index, array) => {
        article.nextArticleUrl = index === 0 ? "" : array[index - 1].url;
        article.previousArticleUrl = index === array.length - 1 ? "" : array[index + 1].url;
    });
};

module.exports = frags => {
    const articles =
        frags.filter(frag => frag.path.startsWith(`${config.sourceArticles}`) &&
            frag.path !== `${config.sourceArticles}${sep}index.html`);
    articles.sort(sort);
    linkArticles(articles);
    return articles;
};
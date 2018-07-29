const { sep } = require("path");

const addArticleDate = metadata => {
    metadata.forEach(item => {
        // add article date to article metadata
        if (item.path.indexOf(`blog${sep}articles`) !== -1) {
            const i = item.path.search(/\d{4}-\d{2}-\d{2}/);
            item.articleDate = item.path.substring(i, i + 10);
        }
    });
};

module.exports = metadata => {
    addArticleDate(metadata);
    return metadata;
};
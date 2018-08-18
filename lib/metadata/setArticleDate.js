const config = require("../config");

module.exports = frags => {
    frags.forEach(frag => {
        if (frag.path.startsWith(config.sourceArticles)) {
            // add article date to article metadata
            const i = frag.path.search(/\d{4}-\d{2}-\d{2}/);
            frag.articleDate = frag.path.substring(i, i + 10);
        }
    });
};

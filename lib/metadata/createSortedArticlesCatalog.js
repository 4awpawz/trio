const { sep, parse } = require("path");
const config = require("../config");

// 2018-01-01-name.ext -> 20180101
const convertFilePathToDate = filePath =>
    parseInt(parse(filePath).name.substring(0, 10).split("-").join(""), 10);

const sort = (a, b) => {
    const n1 = convertFilePathToDate(a.path);
    const n2 = convertFilePathToDate(b.path);
    if (n1 < n2) {
        return -1;
    }
    if (n1 > n2) {
        return 1;
    }
    return 0;
};

module.exports = frags => {
    const articles =
        frags.filter(frag => frag.destPath.startsWith(`${config.publicArticles}`) &&
            frag.destPath !== `${config.publicArticles}${sep}index.html`);
    articles.sort(sort);
    return articles;
};
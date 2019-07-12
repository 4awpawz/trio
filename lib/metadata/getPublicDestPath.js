const { sep, parse, relative, normalize } = require("path");
const config = require("../config");
const isDateValid = require("../utils/dateValidator");
const { log, normalizeArticleFileName, toArray } = require("../utils");

const prefaceMMDDWithZero = str => str.length === 1 ? `0${str}` : str;

const showBadDateMessage = articleFileName => {
    log(`error: incorrect blog artice file name found for article "${articleFileName}"`);
    log("error: blog article file names must be of the form: \"yyyy-mm-dd-filename.[html|md]\"");
    log("error: blog article file names must resolve to a valid date");
};

const getArticleDestPath = articleFileName => {
    articleFileName = normalizeArticleFileName(articleFileName);

    // validate article file name matches expected pattern
    const found = /(\d{4})-(\d{2})-(\d{2})/.test(articleFileName.substring(0, 10));
    if (!found) {
        showBadDateMessage(articleFileName);
        process.exit();
    }

    // validate article file name date
    const parts = articleFileName.substring(0, 10).split("-");
    const yyyy = Number(parts[0]);
    const mm = Number(parts[1]);
    const dd = Number(parts[2]);
    if (isNaN(yyyy) || isNaN(mm) || isNaN(dd) || !isDateValid(mm, dd, yyyy)) {
        showBadDateMessage(articleFileName);
        process.exit();
    }

    // return the article's destination path
    const fileName = articleFileName.substring(11);
    return `${yyyy}${sep}${prefaceMMDDWithZero(mm.toString())}${sep}${prefaceMMDDWithZero(dd.toString())}${sep}${parse(fileName).name}${sep}index.html`;
};

const getArticleCategoryPath = category =>
    category.length > 0 ? category.join(`${sep}`).toLowerCase() : category;

// reflect source's path structure when writing to public folder
// blog article's are specific use cases - their paths are "manufactured"
// by desconstructing their original name:
// (yyyy-mm-dd-filename.[html|md]) ->
// /public/blog/yyyy/mm/dd/filename.html
// all links are generated as "pretty links", meaning:
// all links to pages are links to their conatining folders
// all pages are named index.html and are served when their
// containing foleders are navigated to
module.exports = metadata => {
    if (parse(metadata.path).dir.startsWith(`${config.sourceBlog}`)) {
        // blog
        if (metadata.path.indexOf(config.sourceArticles) !== -1) {
            // article
            const categoryPath = getArticleCategoryPath(metadata.matter.data.category);
            const articlePath = getArticleDestPath(parse(metadata.path).base);
            // if article has category then make it part of the path
            const destPath = categoryPath
                ? `${config.publicArticles}${sep}${categoryPath}${sep}${articlePath}`
                : `${config.publicArticles}${sep}${articlePath}`;
            return normalize(destPath).toLowerCase();
        }
        if (metadata.path.indexOf(config.sourceTag) !== -1) {
            // tag
            const relPath = relative(config.sourceTag, metadata.path);
            const destPath = `${config.publicTag}${sep}${parse(relPath).dir}${sep}${parse(relPath).name}${sep}index.html`;
            return normalize(destPath).toLowerCase();
        }
        if (metadata.path.indexOf(config.sourceCategory) !== -1) {
            // category
            const relPath = relative(config.sourceCategory, metadata.path);
            const categoryPath = toArray(metadata.matter.data.forCategory).join(sep);
            const destPath = `${config.publicCategory}${sep}${parse(relPath).dir}${sep}${categoryPath}${sep}index.html`;
            return normalize(destPath).toLowerCase();
        }
        // all other blog pages (e.g. blog index pages)
        const relPath = relative(config.sourceBlog, metadata.path);
        const destPath = `${config.publicBlog}${sep}${parse(relPath).dir}${sep}${parse(relPath).name}.html`;
        return normalize(destPath).toLowerCase();
    }
    // all other pages (e.g. index page, about page, etc.)
    const dir = parse(metadata.path).dir.replace(config.fragments, config.public);
    if (parse(metadata.path).name === "index") {
        // some index file in some folder
        const destPath = `${dir}${sep}index.html`;
        return normalize(destPath).toLowerCase();
    }
    // some file but not index
    const destPath = `${dir}${sep}${parse(metadata.path).name}${sep}index.html`;
    return normalize(destPath).toLowerCase();
};
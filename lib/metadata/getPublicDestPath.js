const { sep, parse, join } = require("path");
const config = require("../config");
const isDateValid = require("../utils/dateValidator");
const { log, normalizeArticleFileName } = require("../utils");

const prefaceMMDDWithZero = str => str.length === 1 ? `0${str}` : str;

const showBadDateMessage = articleFileName => {
    log(`error: incorrect blog article file name found for article "${articleFileName}"`);
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
// by creating a path relative to blog composed from any categories declared
// and prepending that to the result of deconstructing their original file name:
// (yyyy-mm-dd-filename.[html|md]) ->
// /public/blog/[path from one or more categories]/yyyy/mm/dd/filename.html
// all links are generated as "pretty links", meaning:
// all links to pages are links to their containing folders
// all pages are named index.html and are served when their
// containing folders are navigated to
module.exports = metadata => {
    const baseDir = parse(metadata.path).dir.replace(config.fragments, config.targetFolder);
    // article pages
    if (parse(metadata.path).dir.startsWith(`${config.sourceArticles}`)) {
        // we don't want to include the articles folder in the path
        const articleBaseDir = join(baseDir, "..");
        const categoryPath = getArticleCategoryPath(metadata.matter.data.category);
        const articlePath = getArticleDestPath(parse(metadata.path).base);
        // if article has category then include it in the path
        return categoryPath
            ? `${articleBaseDir}${sep}${categoryPath}${sep}${articlePath}`
            : `${articleBaseDir}${sep}${articlePath}`;
    }
    // all other pages
    const path = parse(metadata.path).name === "index" && join(baseDir, "index.html") ||
        join(baseDir, parse(metadata.path).name, "index.html");
    return path.toLowerCase();
};
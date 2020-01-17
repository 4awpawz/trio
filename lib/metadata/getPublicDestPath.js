/**
 * Write the source file to the target folder reflecting its path structure
 * as well as any permalink which may target it.
 *
 * Blog article's are specific use cases - their paths are "composed" from
 * the categories they may or may not declare and their destructured file names:
 * (yyyy-mm-dd-filename.[html|md]) ->
 * [target folder]/[category path segment[, ...]]/yyyy/mm/dd/filename.html.
 * All links are generated as "pretty links", meaning all links to pages are
 * links to their containing folders and all pages are named index.html and are
 * served when their containing folders are navigated to.
 */

const { sep, parse, join } = require("path");
const config = require("../config");
const isDateValid = require("../utils/dateValidator");
const { log, normalizeArticleFileName } = require("../utils");

const prefaceMMDDWithZero = str => str.length === 1 ? `0${str}` : str;

const showBadDateMessage = articleFileName => {
    log(`Error: Incorrect blog article file name found for article "${articleFileName}"`);
    log("Error: Blog article file names must be of the form: \"yyyy-mm-dd-filename.[html|md]\"");
    log("Error: Blog article file names must resolve to a valid date");
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
    return join(yyyy.toString(), prefaceMMDDWithZero(mm.toString()), prefaceMMDDWithZero(dd.toString()), parse(fileName).name, "index.html");
};

const getArticleCategoryPath = category =>
    category.length > 0 ? category.join(`${sep}`).toLowerCase() : category;

const applyPermalink = (metadata, destinationPath) => {
    if (metadata.matter.data.permalink) {
        return join(config.targetFolder, metadata.matter.data.permalink);
    }
    if (config.userConfig.permalinks) {
        const match = config.userConfig.permalinks.find(permalink =>
            destinationPath.startsWith(join(config.targetFolder, permalink.targetFolder)));
        const path = match && join(config.targetFolder, match.path) || destinationPath;
        return path;
    }
    return destinationPath;
};

module.exports = metadata => {
    let destinationPath;
    // determine public base path
    const baseDir = parse(metadata.path).dir.replace(config.fragments, config.targetFolder);
    if (parse(metadata.path).dir.startsWith(`${config.sourceArticles}`)) {
        // article pages
        // we don't want to include the articles folder in the path so this will resolve to targetFolder/
        const categoryPath = getArticleCategoryPath(metadata.matter.data.category);
        const articlePath = getArticleDestPath(parse(metadata.path).base);
        destinationPath = categoryPath.length > 0
            ? join(applyPermalink(metadata, baseDir), categoryPath, articlePath)
            : join(applyPermalink(metadata, baseDir), articlePath);
    } else {
        // all other pages
        destinationPath = parse(metadata.path).name === "index" &&
            join(applyPermalink(metadata, baseDir), "index.html") ||
            join(applyPermalink(metadata, join(baseDir, parse(metadata.path).name)), "index.html");
    }
    return destinationPath.toLowerCase();
};
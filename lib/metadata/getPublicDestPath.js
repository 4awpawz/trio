const { sep, parse, relative } = require("path");
const config = require("../config");

const getFragmentsRelativePath = path => relative(config.fragments, parse(path).dir);

const prefaceMMDDWithZero = str => str.length === 1 ? `0${str}` : str;

const getDestPathFromArticleFileName = articleFileName => {
    const parts = articleFileName.split("-");
    const yyyy = Number(parts[0]);
    const mm = Number(parts[1]);
    const dd = Number(parts[2]);
    const fileName = parts[3];

    if (isNaN(yyyy) || isNaN(mm) || isNaN(dd)) {
        console.log(`error: incorrect blog artice file name found for article "${articleFileName}"`);
        console.log("error: blog article file names must be of the form: \"yyyy-mm-dd-filename.[html|md]\"");
        process.exit();
    }
    return `${yyyy}${sep}${prefaceMMDDWithZero(mm.toString())}${sep}${prefaceMMDDWithZero(dd.toString())}${sep}${parse(fileName).name}${sep}index.html`;
};

// reflect source's path structure when writing to public folder
// blog article's are specific use cases - their paths are "manufactured"
// by desconstructing their original name:
// (yyyy-mm-dd-filename.[html|md]) ->
// /public/blog/articles/yyyy/mm/dd/filename.html
// all links are generated as "pretty links", meaning:
// all links to pages are links to their conatining folders
// all pages are named index.html and are served when their
// containing foleders are navigated to
module.exports = metadata => {
    if (metadata.path.indexOf(`blog${sep}articles`) !== -1) {
        // articles
        return `${config.publicArticles}${sep}${getDestPathFromArticleFileName(parse(metadata.path).base)}`;
    } else {
        const relPath = getFragmentsRelativePath(metadata.path);
        if (relPath.length) {
            // folders relative to public
            return parse(metadata.path).name === "index"
                ? `${config.public}${sep}${relPath}${sep}index.html`
                : `${config.public}${sep}${relPath}${sep}${parse(metadata.path).name}${sep}index.html`;
        } else {
            // files relative to public
            return parse(metadata.path).name === "index"
                ? `${config.public}${sep}index.html`
                : `${config.public}${sep}${parse(metadata.path).name}${sep}index.html`;
        }
    }
};
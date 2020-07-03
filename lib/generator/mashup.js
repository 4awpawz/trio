/**
 * Creates a composite from a template, its associated fragment,
 * and all the includes that are declared in both.
 */

const { join, parse } = require("path");
const cheerio = require("cheerio");
const {
    callTagCallbacks,
    getAllIncludes,
    getTagCallbacks,
    readCache
} = require("../utils");
const save = require("./save");
const config = require("../config");

// When building for development and replacing the target element with content
// (instead of appending to it), comment out the targeted element instead of
// deleting it so that it is preserved when viewing the source HTML for the
// generated page.
const commentAndReplace = ($selector, asset) => {
    process.env.TRIO_ENV_buildType !== "release" &&
        $selector.before(`<!-- ${$selector.toString()} -->`);
    $selector.replaceWith(asset.matter.content);
};

const mergeContent = ($, selector, asset) => {
    const $selector = $(selector);
    $selector && asset.matter.data.appendToTarget
        ? $selector.append(asset.matter.content)
        : commentAndReplace($(selector), asset);
};

// isIncludeAFile -> bool
// used to determine if include is directly or indirectly referenced
const isIncludeAFile = include => !!parse(include).ext;

const mergeIncludes = ($, frag, includesMetadataMap) => {
    getAllIncludes($).forEach(include => {
        const includeFileName = isIncludeAFile(include)
            ? include
            : frag.matter.data[include];
        const includeMetadata = includesMetadataMap.get(
            join(config.includes, includeFileName)
        );
        mergeContent($, `[data-trio-include='${include}']`, includeMetadata);
    });
};

module.exports = async (frag, includesMetadataMap, siteMetadata) => {
    const $ = cheerio.load(readCache(frag.matter.data.template));
    mergeContent($, `[data-${config.target}='']`, frag);
    mergeIncludes($, frag, includesMetadataMap);
    $("title").text(frag.matter.data.title);
    const tagCallbacksMetadata = getTagCallbacks($);
    for (const tagCallbackMetadata of tagCallbacksMetadata) {
        await callTagCallbacks(
            tagCallbackMetadata.$tag,
            tagCallbackMetadata.callback,
            $,
            frag,
            siteMetadata
        );
    }
    save($, frag.destPath);
};

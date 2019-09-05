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

const mergeContent = ($, selector, target) => {
    target.matter.data.appendToTarget
        ? $(selector).append(target.matter.content)
        : $(selector).replaceWith(target.matter.content);
};

// isIncludeAFile -> bool
// used to determine if include is directly or indirectly referenced
const isIncludeAFile = include => !!parse(include).ext;

const mergeIncludes = ($, frag, includesMetadataMap) => {
    getAllIncludes($).forEach(include => {
        const includeFileName = isIncludeAFile(include)
            ? include : frag.matter.data[include];
        const includeMetadata = includesMetadataMap.get(join(config.includes, includeFileName));
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
        await callTagCallbacks(tagCallbackMetadata.$tag, tagCallbackMetadata.callback, $, frag, siteMetadata);
    }
    save($, frag.destPath);
};
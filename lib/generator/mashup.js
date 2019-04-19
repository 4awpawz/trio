const { join, parse } = require("path");
const cheerio = require("cheerio");
const getAllIncludes = require("../utils/getAllIncludes");
// const { callCallbacks, callTagCallbacks, getTagCallbacks, readCache } = require("../utils");
const { callTagCallbacks, getTagCallbacks, readCache } = require("../utils");
const save = require("./save");
const config = require("../config");

const mergeContent = ($, frag) => frag.matter.data.appendToTarget
    ? $(`[data-${config.target}='']`).append(frag.matter.content)
    : $(`[data-${config.target}='']`).replaceWith(frag.matter.content);

// isIncludeAFile -> bool
const isIncludeAFile = include => !!parse(include).ext;

const mergeIncludes = ($, frag, includesMetadataMap) => {
    getAllIncludes($).forEach(include => {
        // If include has a file extension (e.g. header.html) then it is treated
        // as a file name. Otherwise, include is treated as a reference to a
        // property in frag.matter.data whose value (frag.matter.data[include]
        // specifies a file name including a file extension.
        const includeFileName = isIncludeAFile(include)
            ? include : frag.matter.data[include];
        // const includeMetadata = includesMetadata
        //     .find(item => parse(item.path).base === includeFileName);
        const includeMetadata = includesMetadataMap.get(join(config.includes, includeFileName));
        includeMetadata.matter.data.appendToTarget
            ? $(`[data-trio-include='${include}']`)
                .append(includeMetadata.matter.content)
            : $(`[data-trio-include='${include}']`)
                .replaceWith(includeMetadata.matter.content);
    });
};

module.exports = async (frag, includesMetadataMap, siteMetadata) => {
    const $ = cheerio.load(readCache(frag.matter.data.template));
    mergeContent($, frag);
    mergeIncludes($, frag, includesMetadataMap);
    $("title").text(frag.matter.data.title);
    // if (frag.matter.data.callback) {
    //     await callCallbacks($, frag, siteMetadata);
    // }
    const tagCallbacksMetadata = getTagCallbacks($);
    for (const tagCallbackMetadata of tagCallbacksMetadata) {
        await callTagCallbacks(tagCallbackMetadata.$tag, tagCallbackMetadata.callback, $, frag, siteMetadata);
    }
    save($, frag);
};
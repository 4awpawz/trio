"use strict";
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

// When building for development those tags that are replaced by their content
// are commented out instead of removed so that they are preserved for viewing.
// When building for release those tags that are replaced by their content
// are removed.
const commentAndRemoveTargetTag = (selector, $) => {
    const $selector = $(selector);
    const contents = $selector.html();
    $selector.empty();
    $selector.after(contents);
    process.env.TRIO_ENV_buildType !== "release" &&
        $selector.before(`<!-- ${$(selector).toString()} -->`);
    $selector.remove();
};

const mergeContent = ($, selector, asset) => {
    $(selector).append(asset.matter.content);
};

// return true if the data-trio-include's value actually names the file and false if it's
// a reference to a property in the asset's front matter whose value is the name of the file
const isIncludeAFile = include => !!parse(include).ext;

const mergeIncludes = ($, frag, includesMetadataMap, includes) => {
    includes.forEach(include => {
        const includeFileName = isIncludeAFile(include) ? include : frag.matter.data[include];
        const includeMetadata = includesMetadataMap.get(join(config.includes, includeFileName));
        mergeContent($, `[data-trio-include='${include}']`, includeMetadata);
    });
};

module.exports = async (frag, includesMetadataMap, siteMetadata) => {
    const $ = cheerio.load(readCache(frag.matter.data.template));
    mergeContent($, `[data-${config.target}='']`, frag);
    // get the values from all the "data-trio-include" attributes in the composite
    const includes = getAllIncludes($);
    mergeIncludes($, frag, includesMetadataMap, includes);
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
    // now that all the callbacks have been run for the composite it is safe to comment and remove those tags that aren't appended to
    !frag.matter.data.appendToTarget && commentAndRemoveTargetTag("data-trio-fragment", $);
    includes.forEach(include => {
        const includeFileName = isIncludeAFile(include) ? include : frag.matter.data[include];
        const includeMetadata = includesMetadataMap.get(join(config.includes, includeFileName));
        !includeMetadata.matter || includeMetadata.matter.data.appendToTarget === false && commentAndRemoveTargetTag(`[data-trio-include='${include}']`, $);
    });
    save($, frag.destPath);
};

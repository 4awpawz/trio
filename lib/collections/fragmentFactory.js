"use strict";
/**
 * () -> [fragments]
 */

const { join, parse } = require("path");
const { publicPathToUrl } = require("../utils");
const filter = require("./filter");
const { getPublicDestPath } = require("../metadata");
const validateDataset = require("./validateDataset");
const validateItem = require("./validateItem");

module.exports = (generator, siteMetadata) => {
    const frags = [];
    const collection = generator.matter.data.collection;
    const collectionDataset = filter(collection, siteMetadata);
    if (!validateDataset(collection.filterFn, collectionDataset)) {
        return [];
    }
    for (let index = 0; index < collectionDataset.length; index++) {
        const collectionDatasetItem = collectionDataset[index];
        if (!validateItem(collection.filterFn, collectionDatasetItem, index)) {
            return [];
        }
        const fragment = JSON.parse(JSON.stringify(generator));
        delete fragment.matter.data.collection;
        fragment.generator = generator.path;
        fragment.type = "fragment";
        fragment.isStale = true;
        fragment.collection = { index, ...collectionDatasetItem };
        // begining with v5.0.0 path.parse(collectionDatasetItem.pageName) is not called.
        fragment.path = join(parse(fragment.path).dir, collectionDatasetItem.pageName + parse(fragment.path).ext).toLowerCase();
        fragment.destPath = getPublicDestPath(fragment);
        fragment.url = encodeURI(publicPathToUrl(fragment.destPath).toLowerCase());
        frags.push(fragment);
    }
    for (const item of frags) {
        item.collection.totalItems = frags.length;
    }
    return frags;
};
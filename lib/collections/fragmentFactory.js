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
    const dataset = filter(collection, siteMetadata);
    if (!validateDataset(collection.filterFn, dataset)) {
        return [];
    }
    for (let index = 0; index < dataset.length; index++) {
        const dataItem = dataset[index];
        if (!validateItem(collection.filterFn, dataItem, index)) {
            return [];
        }
        const fragment = JSON.parse(JSON.stringify(generator));
        delete fragment.matter.data.collection;
        fragment.generator = generator.path;
        fragment.type = "fragment";
        fragment.isStale = true;
        fragment.collection = { index, ...dataItem };
        fragment.path = join(parse(fragment.path).dir,
            parse(dataItem.pageName).name + parse(fragment.path).ext).toLowerCase();
        fragment.destPath = getPublicDestPath(fragment);
        fragment.url = encodeURI(publicPathToUrl(fragment.destPath).toLowerCase());
        frags.push(fragment);
    }
    for (const item of frags) {
        item.collection.totalItems = frags.length;
    }
    return frags;
};
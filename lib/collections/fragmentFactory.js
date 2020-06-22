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
    const datasets = filter(collection, siteMetadata);
    if (!validateDataset(collection.filterFn, datasets)) {
        return [];
    }
    for (let index = 0; index < datasets.length; index++) {
        const dataset = datasets[index];
        if (!validateItem(collection.filterFn, dataset, index)) {
            return [];
        }
        const fragment = JSON.parse(JSON.stringify(generator));
        delete fragment.matter.data.collection;
        fragment.generator = generator.path;
        fragment.type = "fragment";
        fragment.isStale = true;
        fragment.collection = { index, ...dataset };
        // begining with v4.0.0 the generated fragment's path includes dataset.pageName's complete path
        fragment.path = join(parse(fragment.path).dir, parse(dataset.pageName).dir,
            parse(dataset.pageName).name + parse(fragment.path).ext).toLowerCase();
        fragment.destPath = getPublicDestPath(fragment);
        fragment.url = encodeURI(publicPathToUrl(fragment.destPath).toLowerCase());
        frags.push(fragment);
    }
    for (const item of frags) {
        item.collection.totalItems = frags.length;
    }
    return frags;
};
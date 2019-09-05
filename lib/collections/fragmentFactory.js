/**
 * () -> [fragments]
 */
const { join, parse } = require("path");
const { publicPathToUrl } = require("../utils");
const filter = require("./filter");
const { getPublicDestPath } = require("../metadata");

module.exports = (generator, siteMetadata) => {
    const frags = [];
    const collection = generator.matter.data.collection;
    filter(collection, siteMetadata).forEach((dataItem, index) => {
        const fragment = JSON.parse(JSON.stringify(generator));
        delete fragment.matter.data.collection;
        fragment.generator = generator.path;
        fragment.type = "fragment";
        fragment.isStale = true;
        // attach a collection object to the fragment itself
        fragment.collection = { index, ...dataItem };
        fragment.path = join(parse(fragment.path).dir,
            parse(dataItem.pageName).name + parse(fragment.path).ext).toLowerCase();
        fragment.destPath = getPublicDestPath(fragment);
        fragment.url = encodeURI(publicPathToUrl(fragment.destPath).toLowerCase());
        frags.push(fragment);
    });
    for (let item of frags) {
        item.collection.totalItems = frags.length;
    }
    return frags;
};
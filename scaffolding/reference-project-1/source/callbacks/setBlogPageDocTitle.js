/*
dataDependencies:
- brand
*/
module.exports = ({ $tag, asset, site }) => {
    $tag.prepend(`${site.dataCatalog.brand.brandName} `);
    $tag.append(` Page ${asset.collection.index + 1} of ${asset.collection.totalItems}`);
};
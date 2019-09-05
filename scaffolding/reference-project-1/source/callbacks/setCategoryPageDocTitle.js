/*
dataDependencies: brand
*/
module.exports = ({ $tag, asset, site }) => {
    $tag.prepend(`${site.dataCatalog.brand.brandName} `);
    $tag.append(` ${asset.collection.data.category}`);
};
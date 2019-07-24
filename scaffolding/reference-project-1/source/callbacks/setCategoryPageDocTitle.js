/*
dataDependencies: brand
*/
module.exports = ({ $tag, asset, site }) => {
    $tag.prepend(`${site.dataCatalog.brand.brandName} `);
    $tag.append(` ${asset.matter.data.forCategory[0]}`);
};
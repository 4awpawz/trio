/*
dataDependencies: brand
*/
module.exports = ({ $tag, site }) => {
    $tag.prepend(`${site.dataCatalog.brand.brandName} `);
};
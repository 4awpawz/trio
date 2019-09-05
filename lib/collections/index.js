/**
 * () -> [fragments]
 */
const fragmentFactory = require("./fragmentFactory");

module.exports = (generators, siteMetadata) => {
    const fragments = [];
    generators.forEach(generator => {
        fragments.push(...fragmentFactory(generator, siteMetadata));
    });
    return fragments;
};
const { parse } = require("path");
const getCachedMatter = require("./getCachedMatter");

module.exports = (templatePath, dataKey, pathsToFragments) => {
    // find the fragment associated with the template
    const fragmentPath = pathsToFragments.find(fragmentPath =>
        getCachedMatter(fragmentPath).data.template === parse(templatePath).base);
    // if found then return the property value for dataKey - will
    // return undefined if fragment wasn't found (not implemented yet) or
    // if found fragment's matter.data doesn't have a key by that name
    if (fragmentPath) {
        const fragmentMatter = getCachedMatter(fragmentPath);
        return fragmentMatter.data[dataKey];
    }
};
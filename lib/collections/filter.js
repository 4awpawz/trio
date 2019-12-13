/**
 * () -> [{pageName, data}...]
 */

const { join } = require("path");
const importFresh = require("import-fresh");
const { filters } = require("../config");
const { log } = require("../utils");

module.exports = (collection, siteMetadata) => {
    try {
        return importFresh(join(process.cwd(), filters, collection.filterFn))({ collection, site: siteMetadata });
    } catch (error) {
        log(error);
    }
};

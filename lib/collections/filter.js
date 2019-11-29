/**
 * () -> [{pageName, data}]
 */
const { join } = require("path");
const importFresh = require("import-fresh");
const { filters } = require("../config");

module.exports = (collection, siteMetadata) =>
    importFresh(join(process.cwd(), filters, collection.filterFn))({ collection, site: siteMetadata });

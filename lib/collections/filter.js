/**
 * () -> [{pageName, data}]
 */
const { join } = require("path");
const requireUncached = require("require-uncached");
const { filters } = require("../config");

module.exports = (collection, siteMetadata) =>
    requireUncached(join(process.cwd(), filters, collection.filterFn))({ collection, site: siteMetadata });

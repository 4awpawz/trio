/**
 * Validate a dataset item.
 * Note: Beginning with v3 the user must name the property that they assign their item's data to as "data".
 * Prior to v3 the user was able to name that property anything they wanted, but that made it impossible
 * to validate the item's integrity.
 */

const { log } = require("../utils");

module.exports = (filterFnName, item, index) => {
    const hasPageNameProperty = item.hasOwnProperty("pageName");
    const hasDataProperty = item.hasOwnProperty("data");
    const printError = missingPropertyName =>
        log(`Error: Item number ${index} returned by filterFn ${filterFnName} is invalid - missing required property "${missingPropertyName}"`);
    !hasPageNameProperty && printError("pageName");
    !hasDataProperty && printError("data");
    return hasPageNameProperty && hasDataProperty;
};

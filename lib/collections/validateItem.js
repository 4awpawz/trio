/**
 * Validate a dataset item.
 * Note: because the user can name the property that they assign the item's data to, it is impossible to validate that.
 */
const { log } = require("../utils");

module.exports = (filterFnName, item, index) => {
    let valid = true;
    let msg = "";
    const keys = Object.keys(item);
    if (keys.length < 2) {
        valid = false;
        msg = (`error item number ${index} returned by filterFn ${filterFnName} is invalid - expected at least 2 properties`);
    } else if (!keys.some(key => key === "pageName")) {
        valid = false;
        msg = (`error item number ${index} returned by filterFn ${filterFnName} is invalid - missing property "pageName"`);
    } else if (typeof item.pageName !== "string") {
        valid = false;
        msg = (`error item number ${index} returned by filterFn ${filterFnName} is invalid - expected property "pageName" to be a string, found ${typeof item.pageName}`);
    }
    if (!valid) {
        log(`Warning filterFn ${filterFnName} returned an invalid dataset:`);
        log(msg);
        return false;
    }
    return true;
};

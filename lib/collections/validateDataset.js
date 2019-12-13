/**
 * Validates the integrity of the dataset returned by the user's filterFn.
 * Returns true | false.
 *
 * Validations:
 * filterFn returned an array.
 * Each item in the dataset has at least 2 properties, and one of them is pagename.
 */

const { log } = require("../utils");

module.exports = (filterFnName, dataset) => {
    let valid = true;
    let msg = "";
    if (typeof dataset === "undefined" || !Array.isArray(dataset)) {
        valid = false;
        msg = (`error expected filterFn ${filterFnName} to return an Array, found ${typeof dataset}`);
    } else if (dataset.length === 0) {
        valid = false;
        msg = (`error filterFn ${filterFnName} returned an empty Array`);
    }
    if (!valid) {
        log(`Warning filterFn ${filterFnName} returned an invalid dataset:`);
        log(msg);
        return false;
    }
    return true;
};

/**
 * Converts arg to [arg] if not already an array.
 */
module.exports = arg => Array.isArray(arg) ? arg : typeof arg !== "undefined" ? [arg] : [];
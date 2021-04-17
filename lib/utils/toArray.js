"use strict";
/**
 * arg -> [arg]
 */

module.exports = arg => typeof arg === "undefined" && [] || Array.isArray(arg) && arg || [arg];
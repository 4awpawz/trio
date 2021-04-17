"use strict";
module.exports = fileName => fileName.startsWith("_")
    ? fileName.substring(1)
    : fileName;
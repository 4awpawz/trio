const config = require("../config");

"use strict";

module.exports = frags =>
    frags.some(frag => frag.path.startsWith(config.sourceArticles));
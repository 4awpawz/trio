const config = require("../config");

module.exports = frags =>
    frags.some(frag => frag.path.startsWith(config.sourceArticles));
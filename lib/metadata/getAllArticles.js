// deprecated
const config = require("../config");

module.exports = frags =>
    frags.filter(frag => frag.path.startsWith(config.sourceArticles));
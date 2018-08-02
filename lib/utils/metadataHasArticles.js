const config = require("../config");

module.exports = metadata =>
    metadata.some(item => item.path.startsWith(config.sourceArticles));
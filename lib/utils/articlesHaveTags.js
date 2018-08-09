const config = require("../config");

module.exports = metadata => metadata.filter(item => item.path.startsWith(config.sourceArticles))
    .some(item => item.tag && item.tag.length);
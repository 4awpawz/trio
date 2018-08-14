const config = require("../config");

module.exports = metadata => metadata.filter(item => item.path.startsWith(config.sourceArticles))
    .some(item => item.category && item.category.length);
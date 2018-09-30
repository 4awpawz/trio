const config = require("../config");

module.exports = metadata => metadata.filter(item => item.path.startsWith(config.sourceArticles))
    .some(item => item.matter.data.category && item.matter.data.category.length);
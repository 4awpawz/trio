const config = require("../config");

module.exports = metadata => metadata.filter(item => item.path.startsWith(config.sourceArticles))
    .some(item => item.matter.data.tag && item.matter.data.tag.length);
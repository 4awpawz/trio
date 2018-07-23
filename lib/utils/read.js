const { readFileSync } = require("fs-extra");

module.exports = path => readFileSync(path, "utf8");

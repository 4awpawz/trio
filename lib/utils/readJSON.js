const read = require("./read");

module.exports = path => {
    return JSON.parse(read(path));
};
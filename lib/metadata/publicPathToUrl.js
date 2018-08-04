const { sep } = require("path");

module.exports = path => {
    const t = path.substring(path.indexOf(`${sep}`));
    return t.indexOf("index.html") !== -1
        ? t.substring(0, t.indexOf("index.html"))
        : t;
};
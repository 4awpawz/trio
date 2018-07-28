const { sep } = require("path");

module.exports = path => {
    // const t = path.substring(path.indexOf(`${sep}`)).replace(/\\/g, "/");
    const t = path.substring(path.indexOf(`${sep}`));
    const tt = t.indexOf("index.html") !== -1
        ? t.substring(0, t.indexOf("index.html"))
        : t;
    return tt.length === 1 ? tt : tt.substring(0, tt.length - 1);
};
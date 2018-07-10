const createPublic = require("../../../index.js");

module.exports = ({environment}) => {
    process.env.TRIO_ENV = environment || "development";
    createPublic();
};
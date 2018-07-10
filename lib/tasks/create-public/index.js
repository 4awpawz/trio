const createPublic = require("../../../index.js");

module.exports = ({environment} = {environment: "development"}) => {
    process.env.TRIO_ENV = environment;
    createPublic();
};
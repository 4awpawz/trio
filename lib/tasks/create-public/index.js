const createPublic = require("../../../index.js");

module.exports = ({environment} = {environment: "development"}) => {
    process.env.TRIO_ENV = environment;
    if (process.env.TRIO_ENV === "release") {
        console.log("building public folder for release");
    } else {
        console.log("building public folder for development");
    }
    createPublic();
};
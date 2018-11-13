const createPublic = require("../../../index.js");

module.exports = async () => {
    if (process.env.TRIO_ENV_buildType === "release") {
        console.log("building public folder for release");
    } else {
        console.log("building public folder for development");
    }
    await createPublic();
};
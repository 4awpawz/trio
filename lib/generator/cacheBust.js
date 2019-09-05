const buster = require("@4awpawz/buster");
const { sep } = require("path");
const { targetFolder } = require("../config");

module.exports = async () => {
    await buster({
        command: "bust",
        options: {
            manifest: false,
            verbose: false,
            safeMode: true
        },
        directives: [
            `${targetFolder}${sep}media${sep}**${sep}*.*:1:${targetFolder}${sep}media`,
            `${targetFolder}${sep}css${sep}**${sep}*.map:1:${targetFolder}${sep}css`,
            `${targetFolder}${sep}**${sep}*.html:2:${targetFolder}`,
            `${targetFolder}${sep}css${sep}**${sep}*.css:3:${targetFolder}${sep}css`,
            `${targetFolder}${sep}scripts${sep}**${sep}*.js:3:${targetFolder}${sep}scripts`
        ]
    });
};

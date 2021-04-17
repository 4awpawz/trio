"use strict";

const buster = require("@4awpawz/buster");
const { sep } = require("path");
const { targetFolder } = require("../config");

module.exports = async () => {
    await buster({
        options: {
            manifest: false,
            verbose: false
        },
        directives: [
            `${targetFolder}${sep}media${sep}**${sep}*.*:1`,
            `${targetFolder}${sep}css${sep}**${sep}*.map:1`,
            `${targetFolder}${sep}scripts${sep}**${sep}*.map:1`,
            `${targetFolder}${sep}**${sep}*.html:2`,
            `${targetFolder}${sep}css${sep}**${sep}*.css:3`,
            `${targetFolder}${sep}scripts${sep}**${sep}*.js:3`
        ]
    });
};

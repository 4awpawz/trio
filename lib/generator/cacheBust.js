const buster = require("@4awpawz/buster");
const { sep } = require("path");

module.exports = async () => {
    await buster({
        command: "bust",
        options: {
            manifest: false,
            verbose: false,
            safeMode: true
        },
        directives: [
            `public${sep}media${sep}**${sep}*.*:1:public${sep}media`,
            `public${sep}css${sep}**${sep}*.map:1:public${sep}css`,
            `public${sep}**${sep}*.html:2:public`,
            `public${sep}css${sep}**${sep}*.css:3:public${sep}css`,
            `public${sep}scripts${sep}**${sep}*.js:3:public${sep}scripts`
        ]
    });
};

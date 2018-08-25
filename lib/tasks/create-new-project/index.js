/**
 * creates a new project
 * input's target folder
 */

const fs = require("fs-extra");
const { sep } = require("path");

const defaultOptions = {
    blogFolderName: "blog",
    baseUrl: ""
};

module.exports = (target) => {
    try {
        console.log("*** trio-new ***");

        if (!target) {
            console.log("*** Please enter a new folder name and try again.");
            process.exit();
        }

        console.log(`*** The target folder is "${target}"`);
        if (fs.existsSync(target)) {
            console.log(`*** The target folder "${target}" already exists`);
            console.log("*** Please enter a new folder name and try again.");
            process.exit();
        }

        // folders

        console.log(`*** Creating folder "${target}${sep}source${sep}callbacks".`);
        fs.ensureDirSync(`${target}${sep}source${sep}callbacks`);

        console.log(`*** Creating folder "${target}${sep}source${sep}css".`);
        fs.ensureDirSync(`${target}${sep}source${sep}css`);

        console.log(`*** Creating folder "${target}${sep}source${sep}data".`);
        fs.ensureDirSync(`${target}${sep}source${sep}data`);

        console.log(`*** Creating folder "${target}${sep}source${sep}fragments".`);
        fs.ensureDirSync(`${target}${sep}source${sep}fragments`);

        console.log(`*** Creating folder "${target}${sep}source${sep}includes".`);
        fs.ensureDirSync(`${target}${sep}source${sep}includes`);

        console.log(`*** Creating folder "${target}${sep}source${sep}media".`);
        fs.ensureDirSync(`${target}${sep}source${sep}media`);

        console.log(`*** Creating folder "${target}${sep}source${sep}sass".`);
        fs.ensureDirSync(`${target}${sep}source${sep}sass`);

        console.log(`*** Creating folder "${target}${sep}source${sep}scripts".`);
        fs.ensureDirSync(`${target}${sep}source${sep}scripts`);

        console.log(`*** Creating folder "${target}${sep}source${sep}templates".`);
        fs.ensureDirSync(`${target}${sep}source${sep}templates`);

        // files

        console.log(`*** Creating file "${target}${sep}.gitignore"`);
        fs.writeFileSync(`${target}${sep}.gitignore`, "node_modules\ntrio.manifest.json\npublic");

        console.log(`*** Creating file "${target}${sep}trio.json"`);
        fs.writeJSONSync(`${target}${sep}trio.json`, defaultOptions, { spaces: "    " });
    } catch (error) {
        console.log("*** An error has occurred. Processing is terminated.");
        console.log(error);
        process.exit();
    }
};
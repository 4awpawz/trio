/**
 * creates a new project by cloning
 * https://github.com/4awpawz/trio-quickstart.git
 * -
 * then makes the new project pristine by deleting
 * folders /.git and /node_modules, and by deleting files
 * /package-lock.json and /pacakge.json
 * and by adding folders source/css and source/scripts
 * -
 * input's target folder
 * -
 */

const fs = require("fs-extra");
const { sep } = require("path");
const clone = require("git-clone");
const url = "https://github.com/4awpawz/trio-quickstart.git";

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

        console.log(`*** Creating target "${target}". Pleae wait...`);

        // clone the repo from github
        clone(url, target, () => {
            // remove folders and files from root project folder
            fs.removeSync(`${target}${sep}.git`);
            fs.removeSync(`${target}${sep}node_modules`);
            fs.removeSync(`${target}${sep}package-lock.json`);
            fs.removeSync(`${target}${sep}package.json`);
            // add folders to source folder
            fs.ensureDirSync(`${target}${sep}source${sep}css`);
            fs.ensureDirSync(`${target}${sep}source${sep}scripts`);
            console.log(`*** ${target} created`);
        });
    } catch (error) {
        console.log("*** An error has occurred. Processing is terminated.");
        console.log(error);
        process.exit();
    }
};
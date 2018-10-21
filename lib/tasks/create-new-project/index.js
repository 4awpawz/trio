/**
 * with no options creates an empty project
 * -
 * with option -q creates a new project by cloning
 * https://github.com/4awpawz/trio-quickstart.git
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

module.exports = (target, option) => {
    try {
        console.log("*** trio-new ***");

        if (option && option !== "-q") {
            console.log(`error: option ${option} is not valid`);
            process.exit();
        }

        const msg = "*** Please enter a new folder name and try again.";

        if (!target) {
            console.log("*** Error: missing path parameter.");
            console.log(msg);
            process.exit();
        }

        if (fs.existsSync(target)) {
            console.log(`*** Error: The target folder "${target}" already exists.`);
            console.log(msg);
            process.exit();
        }

        console.log(`*** The target folder is "${target}"`);

        if (option) {
            // clone the repo from github
            console.log("*** Cloning quickstart project. Please wait...");
            clone(url, target, () => {
                // remove folders and files from root project folder
                fs.removeSync(`${target}${sep}.git`);
                fs.removeSync(`${target}${sep}node_modules`);
                fs.removeSync(`${target}${sep}package-lock.json`);
                fs.removeSync(`${target}${sep}package.json`);
                // add folders to source folder
                fs.ensureDirSync(`${target}${sep}source${sep}css`);
                fs.ensureDirSync(`${target}${sep}source${sep}scripts`);
            });
        } else {
            // create empty project structure
            console.log("*** Creating new project. Please wait...");
            fs.ensureDirSync(`${target}${sep}source${sep}callbacks`);
            fs.ensureDirSync(`${target}${sep}source${sep}css`);
            fs.ensureDirSync(`${target}${sep}source${sep}data`);
            fs.ensureDirSync(`${target}${sep}source${sep}fragments${sep}blog${sep}articles`);
            fs.ensureDirSync(`${target}${sep}source${sep}fragments${sep}blog${sep}category`);
            fs.ensureDirSync(`${target}${sep}source${sep}fragments${sep}blog${sep}tag`);
            fs.ensureDirSync(`${target}${sep}source${sep}includes`);
            fs.ensureDirSync(`${target}${sep}source${sep}media`);
            fs.ensureDirSync(`${target}${sep}source${sep}sass`);
            fs.ensureDirSync(`${target}${sep}source${sep}scripts`);
            fs.ensureDirSync(`${target}${sep}source${sep}templates`);
            const gitIgnore = "node_modules\npublic\ntrio.manifest.json";
            fs.writeFileSync(`${target}${sep}.gitignore`, gitIgnore);
            fs.ensureFileSync(`${target}${sep}trio.json`);
        }

        console.log(`*** ${target} created`);
    } catch (error) {
        console.log("*** An error has occurred. Processing is terminated.");
        console.log(error);
        process.exit();
    }
};
const fs = require("fs-extra");
const { sep } = require("path");

module.exports = (target, option) => {
    try {
        console.log("*** trio-new ***");

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

        // create empty project structure
        console.log("*** Creating new project. Please wait...");
        fs.ensureDirSync(`${target}${sep}source${sep}callbacks`);
        fs.ensureDirSync(`${target}${sep}source${sep}css`);
        fs.ensureDirSync(`${target}${sep}source${sep}etc`);
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

        console.log(`*** ${target} created`);
    } catch (error) {
        console.log("*** An error has occurred. Processing is terminated.");
        console.log(error);
        process.exit();
    }
};
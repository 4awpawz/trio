const fs = require("fs-extra");
const { sep } = require("path");
const log = require("../../utils/log");

module.exports = target => {
    try {
        log("*** trio-new ***");

        const msg = "*** Please enter a new folder name and try again.";

        if (!target) {
            log("*** Error: missing path parameter.");
            log(msg);
            process.exit();
        }

        if (fs.existsSync(target)) {
            log(`*** Error: The target folder "${target}" already exists.`);
            log(msg);
            process.exit();
        }

        log(`*** The target folder is "${target}"`);

        // create empty project structure
        log("*** Creating new project. Please wait...");
        fs.ensureDirSync(`${target}${sep}source${sep}callbacks`);
        fs.ensureDirSync(`${target}${sep}source${sep}css`);
        fs.ensureDirSync(`${target}${sep}source${sep}etc`);
        fs.ensureDirSync(`${target}${sep}source${sep}data`);
        fs.ensureDirSync(`${target}${sep}source${sep}fragments${sep}blog${sep}articles`);
        fs.ensureDirSync(`${target}${sep}source${sep}fragments${sep}blog${sep}category`);
        fs.ensureDirSync(`${target}${sep}source${sep}fragments${sep}blog${sep}tag`);
        fs.ensureDirSync(`${target}${sep}source${sep}fragments${sep}blog${sep}archive`);
        fs.ensureDirSync(`${target}${sep}source${sep}includes`);
        fs.ensureDirSync(`${target}${sep}source${sep}media`);
        fs.ensureDirSync(`${target}${sep}source${sep}sass`);
        fs.ensureDirSync(`${target}${sep}source${sep}scripts`);
        fs.ensureDirSync(`${target}${sep}source${sep}templates`);
        const gitIgnore = "node_modules\npublic\nrelease\ntrio.manifest.json\n.cache";
        fs.writeFileSync(`${target}${sep}.gitignore`, gitIgnore);
        fs.writeJsonSync(`${target}${sep}trio.json`, {});

        log(`*** ${target} created`);
    } catch (error) {
        log("*** An error has occurred and processing has terminated.");
        log(error);
        process.exit();
    }
};
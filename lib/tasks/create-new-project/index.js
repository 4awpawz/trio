"use strict";
const fs = require("fs-extra");
const { join, resolve } = require("path");
const log = require("../../utils/log");
const globFriendly = require("../../utils/globFriendly");

module.exports = (target, options) => {
    try {
        log("*** trio-new ***");

        const msg = "*** Please enter a path and try again.";

        if (!target) {
            log("*** Error: Missing path parameter");
            log(msg);
            process.exit();
        }

        if (fs.existsSync(target) && globFriendly(join(target, "*.*")).length > 0) {
            log(`*** Error: The target folder "${resolve(target)}" is not empty.`);
            log(msg);
            process.exit();
        }

        log(`*** The target folder is "${resolve(target)}"`);

        if (options.length === 0) {
            // create empty project structure
            log("*** Creating new project. Please wait...");
            fs.ensureDirSync(join(target, "source", "callbacks"));
            fs.ensureDirSync(join(target, "source", "filters"));
            fs.ensureDirSync(join(target, "source", "css"));
            fs.ensureDirSync(join(target, "source", "etc"));
            fs.ensureDirSync(join(target, "source", "data"));
            fs.ensureDirSync(join(target, "source", "fragments", "articles"));
            fs.ensureDirSync(join(target, "source", "includes"));
            fs.ensureDirSync(join(target, "source", "lib"));
            fs.ensureDirSync(join(target, "source", "media"));
            fs.ensureDirSync(join(target, "source", "sass"));
            fs.ensureDirSync(join(target, "source", "scripts"));
            fs.ensureDirSync(join(target, "source", "templates"));
            const gitIgnore = "node_modules\npublic\nrelease\ntrio.manifest.json\n.cache";
            fs.writeFileSync(join(target, ".gitignore"), gitIgnore);
            fs.writeJsonSync(join(target, "trio.json"), {});
        } else {
            const savedCWD = process.cwd();
            process.chdir(__dirname);
            const from = join("..", "..", "..", "scaffolding", "reference-project-1");
            const to = join(savedCWD, target);
            fs.copySync(from, to);
            // IMPORTANT: because git doesn't track empty folders,
            // the following folders need to be added to source
            fs.ensureDirSync(join(to, "source", "css"));
            fs.ensureDirSync(join(to, "source", "etc"));
            fs.ensureDirSync(join(to, "source", "lib"));
            fs.ensureDirSync(join(to, "source", "media"));
            fs.ensureDirSync(join(to, "source", "scripts"));
            process.chdir(savedCWD);
        }

        log(`*** ${resolve(target)} created`);
    } catch (error) {
        log("*** An error has occurred and processing has terminated.");
        log(error);
        process.exit();
    }
};
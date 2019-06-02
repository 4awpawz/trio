#!/usr/bin/env node

// ToDo: Validate that this is a project before proceding with any build command the user enters
/**
 * Command line options are specified following the GNU specification
 * (see http://www.catb.org/~esr/writings/taoup/html/ch10s05.html for details).
 */

const log = require("../lib/utils/log");
const { version } = require("../package.json");

process.env.TRIO_ENV_version = version;

// get all of the options and normalize combined options, such as from ["-wi]" to ["-w", "-i"]
const options = [];
process.argv.slice(2)
    .filter(arg => arg[0] === "-")
    .reduce((accum, value) => {
        if (value.startsWith("--")) {
            accum.push(value);
            return accum;
        } else {
            [...value].forEach(item => {
                if (item !== "-") {
                    accum.push(`-${item}`);
                }
            });
            return accum;
        }
    }, options);

// get all of the commands and arguments
const commands = process.argv
    .slice(2)
    .filter(arg => arg[0] !== "-");

// prints generalized help to stdout
const generalHelp = () => {
    log("");
    log("Usage: trio [option] | trio <command> [args]");
    log("");
    log("where [option] is one of:");
    log("    -v | --version (version)");
    log("    -h | --help (this help)");
    log("");
    log("where <command> is one of:");
    log("    n, new, b, build, r, release, s, serve");
    log("");
    log("For command specific help, enter trio -h | --help <command>");
    log("");
};

// prints command specific help to stdout
const commandSpecificHelp = (command) => {
    if (command === "b" || command === "build") {
        log("NAME");
        log("       trio-build - Builds your site.");
        log("");
        log("SYNOPSIS");
        log("       trio build <options>");
        log("");
        log("       alias: trio b");
        log("");
        log("DESCRIPTION");
        log("       This command builds your site.");
        log("");
        log("           trio build");
        log("           trio build [-i | --incremental-build]");
        log("           trio build [-w | --watch]");
        log("           trio build [-i | --incremental-build] [-w | --watch]");
        log("           trio build [-w | --watch] [-s | --serve]");
        log("           trio build [-i | --incremental-build] [-w | --watch] [-s | -serve]");
        log("");
        log("       In the first form, it builds your entire site.");
        log("");
        log("       In the second form, it incrementally builds your site.");
        log("");
        log("       In the third form, it builds your entire site any time a change is made to");
        log("       a file in the source folder.");
        log("");
        log("       In the fourth form, it incrementally builds your site any time a chage");
        log("       is made to a file in the source folder.");
        log("");
        log("       In the fifth form, it builds your entire site any time a change is made to");
        log("       a file in the source folder and serves it in the default browser.");
        log("");
        log("       In the sixth form, it incrementally builds your site any time a change");
        log("       to a file in the source folder and serves it in the default browser.");
        log("");
        log("OPTIONS");
        log("       -i | --incremental-build");
        log("           Builds the site incrementally.");
        log("");
        log("       -w | --watch");
        log("           Watches for changes to files in the source folder.");
        log("");
        log("       -s | --serve");
        log("           Serves the site in the default browser.");
        log("");
    } else if (command === "n" || command === "new") {
        log("NAME");
        log("       trio-new - Create a new empty project.");
        log("");
        log("SYNOPSIS");
        log("       trio new <path>");
        log("");
        log("       alias: trio n");
        log("");
        log("DESCRIPTION");
        log("       This command creates a new empty project in the path folder. This command will");
        log("       abort with an error message if the path folder already exists or if path is invalid");
        log("       or the path is omitted.");
        log("");
    } else if (command === "r" || command === "release") {
        log("NAME");
        log("       trio-release - Build your site for release.");
        log("");
        log("SYNOPSIS");
        log("       trio release");
        log("");
        log("       alias: r");
        log("");
        log("DESCRIPTION");
        log("       This command builds your site for release.");
        log("");
        log("           trio release");
        log("           trio release [-b | --cache-bust]");
        log("");
        log("       In the first form, it builds your site for release.");
        log("");
        log("       In the second form, it builds your site for release with cache busting applied");
        log("");
        log("OPTIONS");
        log("       -b | --cache-bust");
        log("           Applies cache busting to your site.");
        log("");
    } else if (command === "s" || command === "serve") {
        log("NAME");
        log("       trio-serve - Serves your site in the default browser.");
        log("");
        log("SYNOPSIS");
        log("       trio serve");
        log("");
        log("       alias: s");
        log("");
        log("DESCRIPTION");
        log("       This command serves the site in the default browser.");
        log("");
        log("           trio serve");
        log("");
    } else {
        generalHelp();
    }
};

/**
 * command validation and execution
 */

const newCommandParams = {
    opts: [],
    validate: ({ commands }) => commands.length === 2,
    valid: ({ commands }) => {
        const createNewProject = require("../lib/tasks/create-new-project");
        createNewProject(commands[1]);
    },
    invalid: () => generalHelp()
};

const buildCommandParams = {
    opts: ["-w", "--watch", "-i", "--incremental-build", "-s", "--serve"],
    validate: function ({ commands, options }) {
        if (commands.length > 1 || options.length > 3) {
            return false;
        }
        if (options.length > 0 && !options.every(opt => this.opts.includes(opt))) {
            return false;
        }
        return true;
    },
    valid: async ({ options }) => {
        const build = require("../index");
        const watch = require("../lib/tasks/file-watcher");
        process.env.TRIO_ENV_buildType = "development";
        process.env.TRIO_ENV_serveInBrowser =
            options.some(opt =>
                opt === "-s" || opt === "--serve")
                ? "serve-in-browser"
                : "no-serve-in-browser";
        process.env.TRIO_ENV_buildIncrementally =
            options.some(opt =>
                opt === "-i" || opt === "--incremental-build")
                ? "incremental-build"
                : "no-incremental-build";
        process.env.TRIO_ENV_watching =
            options.some(opt =>
                opt === "-w" || opt === "--watch")
                ? "watch"
                : "no-watch";
        await build();
        if (process.env.TRIO_ENV_watching === "watch") {
            await watch();
        }
    },
    invalid: () => generalHelp()
};

const serveCommandParams = {
    validate: function ({ commands, options }) {
        if (commands.length > 1 || options.length > 0) {
            return false;
        }
        return true;
    },
    valid: async ({ options }) => {
        const browserSync = require("../lib/utils/browserSync");
        process.env.TRIO_ENV_buildType = "serve";
        process.env.TRIO_ENV_serveInBrowser = "serve-in-browser";
        browserSync();
    },
    invalid: () => generalHelp()
};

const releaseCommandParams = {
    opts: ["-b", "--cache-bust"],
    validate: function ({ commands, options }) {
        if (commands.length > 1 || options.length > 1) {
            return false;
        }
        if (options.length > 0 && !options.every(opt => this.opts.includes(opt))) {
            return false;
        }
        return true;
    },
    valid: async () => {
        const build = require("../index");
        process.env.TRIO_ENV_buildType = "release";
        process.env.TRIO_ENV_serveInBrowser = "no-serve-in-browser";
        process.env.TRIO_ENV_buildIncrementally = "no-incremental-build";
        process.env.TRIO_ENV_watching = "no-watch";
        process.env.TRIO_ENV_cacheBust =
            options.some(opt =>
                opt === "-b" || opt === "--cache-bust")
                ? "cache-bust"
                : "no-cache-bust";
        await build();
    },
    invalid: () => generalHelp()
};

const validCommandOptions = new Map();
validCommandOptions.set("new", newCommandParams);
validCommandOptions.set("n", newCommandParams);
validCommandOptions.set("build", buildCommandParams);
validCommandOptions.set("b", buildCommandParams);
validCommandOptions.set("serve", serveCommandParams);
validCommandOptions.set("s", serveCommandParams);
validCommandOptions.set("release", releaseCommandParams);
validCommandOptions.set("r", releaseCommandParams);

// command runner
(async () => {
    if (commands.length === 0 && options[0] === "-v" || options[0] === "--version") {
        log(version);
        log("");
    } else if (options[0] === "-h" || options[0] === "--help") {
        if (commands[0]) {
            commandSpecificHelp(commands[0]);
        } else {
            generalHelp();
        }
    } else {
        const commandParams = validCommandOptions.get(commands[0]);
        if (commandParams) {
            if (commandParams.validate({ commands, options })) {
                await commandParams.valid({ commands, options });
            } else {
                commandParams.invalid();
            }
        } else {
            generalHelp();
        }
    }
}
)();
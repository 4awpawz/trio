#!/usr/bin/env node
"use strict";
/**
 * Command line options are specified following the GNU specification
 * (see http://www.catb.org/~esr/writings/taoup/html/ch10s05.html for details).
 */

const log = require("../lib/utils/log");
const { readCache } = require("../lib/utils/readCache");
const fileNames = require("../lib/config/fileNames");
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

const getBaseUrl = () => readCache(fileNames.userConfigFileName).baseUrl || "";

// prints generalized help to stdout
const generalHelp = () => {
    log("");
    log("Usage: trio [option] | trio [command] [args]");
    log("");
    log("where [option] is one of:");
    log("    -v | --version (version)");
    log("    -h | --help (this help)");
    log("");
    log("where [command] is one of:");
    log("    n, new, b, build, r, release, B, Bust, s, serve");
    log("");
    log("For command specific help, enter trio -h | --help [command]");
    log("");
};

// prints command specific help to stdout
const commandSpecificHelp = (command) => {
    if (command === "b" || command === "build") {
        log("NAME");
        log("       trio-build - Builds your site.");
        log("");
        log("SYNOPSIS");
        log("       trio build [options]");
        log("");
        log("       alias: trio b");
        log("");
        log("DESCRIPTION");
        log("       This command builds your site targeting the public folder.");
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
        log("       In the fourth form, it incrementally builds your site any time a change");
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
        log("       -I");
        log("           Shortcut for -iws.");
        log("");
        log("       -m");
        log("           Prints detailed metrics.");
        log("");
    } else if (command === "n" || command === "new") {
        log("NAME");
        log("       trio-new - Create a new project.");
        log("");
        log("SYNOPSIS");
        log("       trio new [options] [path]");
        log("");
        log("       alias: trio n");
        log("");
        log("DESCRIPTION");
        log("       This command creates a new project in the path folder. This command will");
        log("       abort with an error message if the path folder already exists or if path is invalid");
        log("       or the path is omitted.");
        log("");
        log("           trio new [path]");
        log("           trio new [-s | --scaffold] [path]");
        log("");
        log("       In the first form, it creates a new bare project in the path folder.");
        log("");
        log("       In the second form, it creates a new project with scaffolding in the path folder.");
        log("");
        log("OPTIONS");
        log("       -s | --scaffold");
        log("           Creates a new project with scaffolding.");
        log("");
    } else if (command === "r" || command === "release") {
        log("NAME");
        log("       trio-release - Builds your site for release.");
        log("");
        log("SYNOPSIS");
        log("       trio release [options]");
        log("");
        log("       alias: r");
        log("");
        log("DESCRIPTION");
        log("       This command builds your site for release targeting the release folder.");
        log("");
        log("           trio release");
        log("");
        log("       In the first and only form, it builds your site for release.");
        log("");
        log("OPTIONS");
        log("       -m");
        log("           Prints detailed metrics.");
        log("");
    } else if (command === "c" || command === "cachebust") {
        log("NAME");
        log("       trio-cachebust - Cache busts the release build residing in the release folder.");
        log("");
        log("SYNOPSIS");
        log("       trio cachebust [options]");
        log("");
        log("       alias: c");
        log("");
        log("DESCRIPTION");
        log("       This command cache busts the release build residing in the release folder.");
        log("");
        log("           trio cachebust");
        log("           trio cachebust [-v | --verbose]");
        log("           trio cachebust [-m | --manifest]");
        log("           trio cachebust [-v | --verbose m] [-m | manifest]");
        log("");
        log("       In the first form, it cache busts the release build residing in the release folder.");
        log("       In the second form, it cache busts the release build residing in the release folder");
        log("       and provides verbose cache busting details.");
        log("       In the third form, it cache busts the release build residing in the release folder");
        log("       and provides a manifest.");
        log("       In the fourth form, it cache busts the release build residing in the release folder");
        log("       and provides both verbose cache busting details and a manifest.");
        log("");
        log("OPTIONS");
        log("       -v | --verbose");
        log("           Provides verbose cache busting details.");
        log("       -m | --manifest");
        log("           Provides a manifest.");
        log("       -V");
        log("           Shortcut for -vm.");
        log("");
    } else if (command === "s" || command === "serve") {
        log("NAME");
        log("       trio-serve - Serves your site in the default browser.");
        log("");
        log("SYNOPSIS");
        log("       trio serve [options]");
        log("");
        log("       alias: s");
        log("");
        log("DESCRIPTION");
        log("       This command serves the site in the default browser.");
        log("");
        log("           trio serve");
        log("           trio serve -r");
        log("");
        log("       In the first form, it serves your site from the public folder");
        log("");
        log("       In the second form, it serves your site from the release folder");
        log("");
        log("OPTIONS");
        log("       -r | --release");
        log("           Serves your site from the release folder.");
        log("");
    } else {
        generalHelp();
    }
};

/**
 * command validation and execution
 */

const newCommandParams = {
    opts: ["-s", "--scaffold"],
    validate: function ({ commands, options }) {
        // commands.length === 2 && options.length <= 1,
        if (commands.length > 2 || options.length > 1) {
            return false;
        }
        if (options.length > 0 && !options.every(opt => this.opts.includes(opt))) {
            return false;
        }
        return true;
    },
    valid: ({ commands, options }) => {
        const createNewProject = require("../lib/tasks/create-new-project");
        createNewProject(commands[1], options);
    },
    invalid: () => generalHelp()
};

const buildCommandParams = {
    opts: ["-w", "--watch", "-i", "--incremental-build", "-s", "--serve", "-I", "-m"],
    validate: function ({ commands, options }) {
        if (commands.length > 1 || options.length > 4) {
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
        process.env.TRIO_ENV_printMetrics =
            options.some(opt =>
                opt === "-m")
                ? "print-metrics"
                : "no-print-metrics";
        process.env.TRIO_ENV_serveInBrowser =
            options.some(opt =>
                opt === "-s" || opt === "--serve" || opt === "-I")
                ? "serve-in-browser"
                : "no-serve-in-browser";
        process.env.TRIO_ENV_buildIncrementally =
            options.some(opt =>
                opt === "-i" || opt === "--incremental-build" || opt === "-I")
                ? "incremental-build"
                : "no-incremental-build";
        process.env.TRIO_ENV_watching =
            options.some(opt =>
                opt === "-w" || opt === "--watch" || opt === "-I")
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
    opts: ["-r", "--release"],
    validate: function ({ commands, options }) {
        if (commands.length > 1 || options.length > 1) {
            return false;
        }
        if (options.length > 0 && !options.every(opt => this.opts.includes(opt))) {
            return false;
        }
        return true;
    },
    valid: async ({ options }) => {
        process.env.TRIO_ENV_serveInBrowser = "serve-in-browser";
        if (options.length === 1) {
            process.env.TRIO_ENV_buildType = "release";
            // note: config is required here just for side effects, specifically so that it
            // correctly sets the public folder to either "./public" or "./release", which
            // BrowserSync will use as the site's base directory
            require("../lib/config");
        }
        // Since v3 process.env.TRIO_ENV_baseUrl is no longer set by configuration and is
        // now set directly by userConfig, which is run by the generator which is not run
        // for the serve command as there is nothing to generate. Therefore, it must
        // be set here for browsersync to work correctly.
        process.env.TRIO_ENV_baseUrl = getBaseUrl();
        const browserSync = require("../lib/utils/browserSync");
        browserSync();
    },
    invalid: () => generalHelp()
};

const releaseCommandParams = {
    opts: ["-m"],
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
        process.env.TRIO_ENV_buildType = "release";
        process.env.TRIO_ENV_serveInBrowser = "no-serve-in-browser";
        process.env.TRIO_ENV_buildIncrementally = "no-incremental-build";
        process.env.TRIO_ENV_watching = "no-watch";
        process.env.TRIO_ENV_printMetrics =
            options.some(opt =>
                opt === "-m")
                ? "print-metrics"
                : "no-print-metrics";
        const build = require("../index");
        await build();
    },
    invalid: () => generalHelp()
};

const cacheBustCommandParams = {
    opts: ["-v", "--verbose", "-m", "--manifest", "-V"],
    validate: function ({ commands, options }) {
        if (commands.length > 1 || options.length > 2) {
            return false;
        }
        if (options.length > 0 && !options.every(opt => this.opts.includes(opt))) {
            return false;
        }
        return true;
    },
    valid: async () => {
        const cacheBust = require("../lib/tasks/cache-bust/cacheBust");
        await cacheBust(options).catch(e => {
            console.log("Something went wrong. Try running 'trio -r' first and then try again.");
            console.log(e);
        });
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
validCommandOptions.set("cachebust", cacheBustCommandParams);
validCommandOptions.set("c", cacheBustCommandParams);

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
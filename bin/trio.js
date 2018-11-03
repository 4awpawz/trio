#!/usr/bin/env node

const createNewProject = require("../lib/tasks/create-new-project");
const build = require("../lib/tasks/create-public");
const watch = require("../lib/tasks/file-watcher");

const log = console.log.bind(console);
const version = "0.0.1";
const validCommands = ["b", "build", "n", "new", "r", "release", "s", "serve"];
const validOptions = ["-h", "--help", "-v", "--version", "-q"];
const validSoloOptions = ["-h", "--help", "-v", "--version"];
const validSoloCommands = ["b", "build", "r", "release", "n", "new", "s", "serve"];

// get all of the options
const options = process.argv.slice(2).filter(arg => arg[0] === "-");

// get all of the commands and parameters/values
const command = process.argv.slice(2).filter(arg => arg[0] !== "-");

// prints generalized help to stdout
const generalHelp = () => {
    log("");
    log("Usage: trio [option] | trio <command>");
    log("");
    log("where [option] is one of:");
    log("    -v | --version (version)");
    log("    -h | --help (this help)");
    log("");
    log("where <command> is one of:");
    log("    b, build, n, new, r, release, s, serve ");
    log("");
    log("For command specific help, enter trio -h | --help <command>");
    log("");
};

// prints command specific help to stdout
const commandSpecificHelp = (command) => {
    if (command === "b" || command === "build") {
        log("Usage: trio build");
        log("Aliases: b");
        log("");
        log("builds public folder for development");
        log("");
    } else if (command === "n" || command === "new") {
        log("Usage: trio new [path/to/new/project]");
        log("Aliases: n");
        log("");
        log("create a new empty project in path folder");
        log("use -q option to clone quickstart project in path folder");
        log("");
    } else if (command === "r" || command === "release") {
        log("Usage: trio release");
        log("Aliases: r");
        log("");
        log("builds public folder for release");
        log("");
    } else if (command === "s" || command === "serve") {
        log("Usage: trio serve");
        log("Aliases: s");
        log("");
        log("launches browser and watches for changes");
        log("");
    } else {
        generalHelp();
    }
};

const isCommandValid = () => {
    const validateCommandOptionPairs = () => {
        if (options[0] === "-h" || options[0] === "--help") {
            return validCommands.some(command => command === command[0]);
        } else if (options[0] === "-q" && command[0] === "n" || command[0] === "new") {
            return true;
        } else {
            return false;
        }
    };

    if (options[0] && options.length === 1 &&
        !validOptions.some(option => option === options[0])) {
        return false;
    }
    if (command[0] && command.length === 1 &&
        !validCommands.some(command => command === command[0])) {
        return false;
    }
    if (options[0] && command[0] && !validateCommandOptionPairs()) {
        return false;
    }
    if (options[0] && !validSoloOptions.some(option => option === options[0])) {
        return false;
    }
    if (command[0] && !validSoloCommands.some(command => command === command[0])) {
        return false;
    }

    return true;
};

if (!isCommandValid()) {
    generalHelp();
    process.exit();
}

// command runner
if (options[0] === "-v" || options[0] === "--version") {
    log(version);
    log("");
} else if (options[0] === "-h" || options[0] === "--help") {
    if (command[0]) {
        commandSpecificHelp(command[0]);
    } else {
        generalHelp();
    }
} else if (command[0] === "b" || command[0] === "build") {
    build();
} else if (command[0] === "n" || command[0] === "new") {
    createNewProject(command[1], options[0]);
} else if (command[0] === "r" || command[0] === "release") {
    build({ environment: "release" });
} else if (command[0] === "s" || command[0] === "serve") {
    log("launching browser and watching for changes");
    watch();
} else {
    generalHelp();
}

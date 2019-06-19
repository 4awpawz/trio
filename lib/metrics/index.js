/**
 * Uses process.hrtime(time) for nano second precision.
 *
 * api: startTimer, stopTimer, getTimer, forEachTimer, clearTimers
 */

const timers = new Map();

const startTimer = (name, precision = 3) => {
    const timer = {
        name,
        precision,
        started: process.hrtime()
    };
    timers.set(name, timer);
};

const stopTimer = name => {
    const timer = timers.get(name);
    // divide by a million to get nano to milli
    const mills = process.hrtime(timer.started)[1] / 1000000;
    // print message + time
    timer.elapsed = (timer.name + ": " +
        process.hrtime(timer.started)[0] + " s, " +
        mills.toFixed(timer.precision) + " ms");
    return timer.elapsed;
};

const getTimer = name => timers.get(name);

const forEach = (callbackFn, thisArg) => timers.forEach(callbackFn, thisArg);
const clearTimers = () => timers.clear();

module.exports = {
    startTimer,
    stopTimer,
    getTimer,
    forEach,
    clearTimers
};
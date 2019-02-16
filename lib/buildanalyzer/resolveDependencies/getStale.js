/**
 * Returns an array of stats that have been
 * modified since the last build's timestamp
 * (i.e. stats of stale files).
 */
module.exports = (stats, timestampMs) => {
    return stats.filter(stat => stat.type !== "*" && stat.mtimeMs > timestampMs);
};
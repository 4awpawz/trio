const { readCache } = require("../utils");
const defaultOptions = require("../config/defaultOptions");
const { userConfigFileName } = require("../config/fileNames");
const getPermalinks = require("../config/permalinks");

module.exports = () => {
    const userConfig = readCache(userConfigFileName);
    userConfig.permalinks = getPermalinks(userConfig.permalinks);
    userConfig.baseUrl = userConfig.baseUrl || "";
    process.env.TRIO_ENV_baseUrl = userConfig.baseUrl;
    return { ...defaultOptions, ...userConfig };
};

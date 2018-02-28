const sinon = require("sinon");

let oSpies = {};

const fnGetName = function() {
    return "Mockname";
};

oSpies.getName = sinon.spy(fnGetName);

const fnGetPrefix = function() {
    return ">";
};

oSpies.getPrefix = sinon.spy(fnGetPrefix);

const fnGetToken = function() {
    return "Mocktoken";
};

oSpies.getToken = sinon.spy(fnGetToken);

const fnGetSettings = function() {
    return {
        adminRoles: ["Mockrole"],
        requiredPermissions: ["Mockpermission"],
        guildId: "MockGuildId",
        botCmdId: "MockChannelId"
    };
};

oSpies.getSettings = sinon.spy(fnGetSettings);

const fnGetMysqlSettings = function() {
    return {
        url: "Mockurl",
        user: "Mockuser",
        password: "Mockpassword",
        database: "Mockdatabase"
    };
};

oSpies.getMysqlSettings = sinon.spy(fnGetMysqlSettings);

const fnSetMysqlSettings = function() {};

oSpies.setMysqlSettings = sinon.spy(fnSetMysqlSettings);

const fnLoadConfig = function() {
    return new Promise((resolve, reject) => {
        resolve();
    });
};

oSpies.loadConfig = sinon.spy(fnLoadConfig);

let fullMock = {
    getName: oSpies.getName,
    getPrefix: oSpies.getPrefix,
    getToken: oSpies.getToken,
    getSettings: oSpies.getSettings,
    getMysqlSettings: oSpies.getMysqlSettings,
    setMysqlSettings: oSpies.setMysqlSettings,
    loadConfig: oSpies.loadConfig,
    "@noCallThru": true /* If this is true it surpresses the call through to the module. In this case non-mocked functions/properties won't be present
                           If set to false it will overwrite everything that we mock and keep the rest as "live data" */
};

exports.full = function () {
    return fullMock;
};

exports.getSpies = function (name) {
    if (oSpies[name]) {
        return oSpies[name];
    }
    else {
        return oSpies;
    }
};

exports.resetSpies = function (name) {
    if (oSpies[name]) {
        return oSpies[name];
    } else {
        Object.keys(oSpies).forEach(key => {
            oSpies[key].resetHistory();
        });
    }
};
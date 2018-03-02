const mysqlHandler = require("../util/mysql_handler");
let _settings = {
    // Your bot name. Typically, this is your bot's username without the discriminator.
    // i.e: if your bot's username is MemeBot#0420, then this option would be MemeBot.
    name: "SweetieBot",

    // The bot's command prefix. The bot will recognize as command any message that begins with it.
    // i.e: "> foo" will trigger the command "foo",
    //      whereas "SweetieBot foo" will do nothing at all.
    prefix: ">",

    // Your bot's user token. If you don't know what that is, go here:
    // https://discordapp.com/developers/applications/me
    // Then create a new application and grab your token.
    token: process.env.sweetiebotToken || "empty",
    devToken: process.env.sweetiebotToken_dev || "empty",

    // If this is true the beta bot will be started!
    devmode: (process.argv.indexOf("dev") > 0) ? true : false,

    settings: {
        adminRoles: [],
        requiredPermissions: [],
        guildId: "",
        botCmdId: ""
    },

    mysql: {
        url: process.env.mysqlUrl || "",
        user: process.env.mysqlUser || "",
        password: process.env.mysqlPassword || "",
        database: null
    }
};

module.exports = {
    getName: function() {
        return _settings.name;
    },

    getPrefix: function() {
        return _settings.prefix;
    },

    getToken: function() {
        return _settings.devmode ? _settings.devToken : _settings.token; 
    },

    getSettings: function() {
        return _settings.settings;
    },

    getMysqlSettings: function() {
        return _settings.mysql;
    },

    setMysqlSettings: function(oSettings) {
        if(!oSettings.url || !oSettings.user || !oSettings.password || !oSettings.database) {
            return;
        }

        _settings.mysql = oSettings;
    },

    loadConfig: function () {
        _settings.mysql.database = _settings.devmode ? "sweetiebot_dev" : "sweetiebot";
        return new Promise((resolve, reject) => {
            let fnLoadAdminRoles = loadAdminRoles.bind(this);
            fnLoadAdminRoles()
                .then(loadPermissions.bind(this))
                .then(loadSettings.bind(this))
                .then(resolve);

            function loadAdminRoles() {
                return new Promise((resolve, reject) => {
                    mysqlHandler.getConnection().then(connection => {
                        connection.query("SELECT * FROM adminRoles", (err, rows) => {
                            if (rows) {
                                for (let i = 0; i < rows.length; ++i) {
                                    _settings.settings.adminRoles.push(rows[i].id);
                                }
                            }
                            resolve();
                        });
                    });
                });
            }

            function loadPermissions() {
                return new Promise((resolve, reject) => {
                    mysqlHandler.getConnection().then(connection => {
                        connection.query("SELECT * FROM permissions", (err, rows) => {
                            if (rows) {
                                for (let i = 0; i < rows.length; ++i) {
                                    _settings.settings.requiredPermissions.push(rows[i].name);
                                }
                            }
                            resolve();
                        });
                    });
                });
            }

            function loadSettings() {
                return new Promise((resolve, reject) => {
                    mysqlHandler.getConnection().then(connection => {
                        connection.one("SELECT * FROM settings", (err, row) => {
                            if (row) {
                                Object.keys(row).forEach(key => {
                                    _settings.settings[key] = row[key];
                                });
                            }
                            resolve();
                        });
                    });
                });
            }
        });
    }
};

const mysql = require("mysql");
const nodeSql = require("nodesql");

let mysqlSettings = {
    host: null,
    user: null,
    password: null,
    database: null,
    multipleStatements: false
};
let db = null;
let connection = null;
let initialised = false;

exports.getConnection = function () {
    if(!initialised) {
        init();
    }

    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
        } else {
            createConnection().then(() => {
                resolve(db);
            })
                .catch((error) => {
                    // Something went wrong. Let's try one more time before panicking
                    createConnection().then(() => {
                        resolve(db);
                    })
                        .catch((error) => {
                            reject(error);
                        });
                });
        }
    });
};

exports.testDatabase = function () {
    if(!initialised) {
        init();
    }
    
    return new Promise((resolve, reject) => {
        connection.ping(err => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
};

function createConnection() {
    return new Promise((resolve, reject) => {
        if (connection)
            connection.destroy();

        connection = mysql.createConnection(mysqlSettings);
        connection.on("error", function (err) {
            console.error("DATABASE ERROR:");
            console.error(err);
            switch (err.code) {
            case "PROTOCOL_CONNECTION_LOST":
            case "PROTOCOL_PACKETS_OUT_OF_ORDER": // This usually happens after a root reboot. No idea why!
                createConnection();
                break;
            default:
                reject(err);
            }
        });

        db = nodeSql.createMySqlStrategy(connection);

        if (!db) {
            // Can't connect to database.
            reject({ error: "Error connecting to database." });
        }
        resolve();
    });
}

function init() {
    const cfg = require("../bot/config");
    let oSettings = cfg.getMysqlSettings();

    mysqlSettings.host = oSettings.url;
    mysqlSettings.user = oSettings.user;
    mysqlSettings.password = oSettings.password;
    mysqlSettings.database = oSettings.database;
}
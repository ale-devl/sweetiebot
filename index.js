let cfg = require("./api/bot/config");

cfg.loadConfig()
    .then(initBot);

function initBot() {
    let bot = require("./api/bot/bot.js");

    process.on("uncaughtException", err => {
        console.log("Uncaught Exception: " + err);
        console.log("Logging out of Discord and then quitting process...");
    
        bot.getBot().fetchUser("166154532714184704")
            .then(owner => {
                console.log("err: " + err);
                owner.send("Uncaught Exception: " + err).then(() => {
                    bot.destroy()
                        .then(() => {
                            process.exit(1);
                        });
                });
            })
            .catch(error => {
                console.log(error);
            });
    });
    bot.init()
        .then(() => console.log("Running!"));
}
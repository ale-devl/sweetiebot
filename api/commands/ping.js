exports.execute = function (args) {
    return args.msg.channel.send("Pong!");
};

exports.getDescription = function () {
    return {
        name: "ping",
        desc: "Ping Pong. No further description needed!",
        args: [],
        example: "> ping"
    };
};


exports.isUsingArguments = function () {
    return false;
};
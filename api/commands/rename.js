const authChecker = require("../util/auth_checker");

exports.execute = function (args) {
    args.mentionString = args.arguments[0];
    let regex = new RegExp("> rename " + args.mentionString + " ", "ig");
    args.newNick = args.msg.content.replace(regex, "");
    handleRename(args);
};

exports.getDescription = function () {
    return {
        name: "rename",
        desc: "Renames a Guildmember. Permissions required!",
        args: [{
            name: "name",
            desc: "Name of the Member that should be renamed. This needs to be a mention.",
            type: "string",
            required: true
        }],
        example: "> rename @aletuna fu$%ingidiot"
    };
};

exports.isUsingArguments = function () {
    return false;
};

function handleRename(args) {
    let callerId = args.msg.member.id;
    let targetId = args.mentionString.replace(/<|!|@|>/g, "");
    let guild = args.msg.guild;

    authChecker.checkAuthorization(callerId)
        .then(() => guild.members.find("id", targetId))
        .then(member => {
            member.setNickname(args.newNick);
        });
}
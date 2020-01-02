module.exports = {
    isDev: function(member) {
        return (member.hasPermission(`ADMINISTRATOR`) || member.roles.find(r => r.name === "Developer"))
    }
};
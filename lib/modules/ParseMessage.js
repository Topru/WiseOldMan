module.exports = function ParseMessage() {
    this.parseCommand = function(message, callback){
        if (message.startsWith(".")) {
            callback(message.split('.')[1].split(" ")[0]);
        }
        if (message.startsWith("!")) {
            callback(message.split('!')[1].split(" ")[0]);
        }
    }
}
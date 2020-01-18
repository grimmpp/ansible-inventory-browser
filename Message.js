const colorG = "\x1b[32m"
const colorB = "\x1b[34m"
const colorR = "\x1b[31m"
const colorLG = "\x1b[90m"
const colorRst = "\x1b[0m"

class Message {

    constructor(issue, resourceType, resource, inventory, details){
        this.type = 'message'
        this.issue = issue.toLowerCase()
        this.resourceType = resourceType.toLowerCase()
        this.resource = resource
        this.inventory = inventory.split('/').pop()
        this.details = details
    }

    static staticConstructor() {
        Message.allMessages = []
        Message.loggingEnabled = false
    }

    static create(issue, resourceType, resource, inventory, details, forceLogOutput=false) {
        var msg = new Message(issue, resourceType, resource, inventory, details)

        if (Message.loggingEnabled || forceLogOutput) {
            console.log("%s%s%s: %s", colorR,issue,colorRst, Message.colorString(Message.colorString(details, "'", colorG), '"', colorLG))
        }

        Message.allMessages.push(msg)
    }

    static colorString(str, splitSep, color) {
        var result = ""
        var array = str.split(splitSep)
        for(var i=0; i<array.length; i+=2) {
            result += array[i]
            if (i+1 < array.length) {
                result += splitSep + color
                result += array[i+1] + colorRst + splitSep
            }
        }
        return result
    }

    static enableLogging() {
        Message.loggingEnabled = true
    }

    static disableLogging() {
        Message.loggingEnabled = true
    }

    static isLoggingEnabled() {
        return Message.loggingEnabled
    }

    static getAllCreatedMessages() {
        return Message.allMessages
    }
}

Message.staticConstructor()

module.exports = Message
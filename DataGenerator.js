const path = require('path')
const fs = require('fs')

const Message = require('./Message.js')
const Group = require('./Group.js')
const Host = require('./Host.js')
const ResourceHelper = require('./ResourceHelper.js')
const Inventory = require('./Inventory.js')

const colorG = "\x1b[32m"
const colorB = "\x1b[34m"
const colorR = "\x1b[31m"
const colorRst = "\x1b[0m"

class DataGenerator {

    static parseInventoriesAndGenerateData(inventoryConfigFilename) {
        var data = {}
        data["hosts"] = []
        data["groups"] = []
        data["messages"] = []
    
        var config = JSON.parse( fs.readFileSync( inventoryConfigFilename, 'utf8') )
        var inventoryConfig = config['inventory-config']
        var inventories = []
    
        for (var index in inventoryConfig) {
            var inv = new Inventory(inventoryConfig[index])
    
            if (Message.isLoggingEnabled()) console.log("%sParse%s hosts file ('%s%s%s'): '%s%s%s' for inventory '%s%s%s'", 
                colorG,colorRst, colorG,inv.hostsFileFormat,colorRst, colorB,inv.dir,colorRst, colorB,inv.name,colorRst)
    
            if (inv.isIniHostsFileFormat()) {
                inv.flatGroupList = Group.generateFlatGroupListFromIniFile(inv.dir, inv.env)
                inv.flatHostList = Host.generateHostListFromIniFile(inv.dir, inv.env)
                
            } else if (inv.isYamlHostsFileFormat()) {
                inv.flatGroupList = Group.generateFlatGroupListFromYamlFile(inv.dir, inv.env)
                inv.flatHostList = Host.generateHostListFromYamlFile(inv.dir, inv.env)
    
            } else {
                Message.create("error", "parser", "parser", inv.name, "parsing error: hosts file format from inventory '"+inv.name+"' unknown.", verboseLogging)
            }
    
            ResourceHelper.addShortcuts(inv.name, 'host', inv.shortcutsConfig, inv.flatHostList)
            ResourceHelper.addShortcuts(inv.name, 'group', inv.shortcutsConfig, inv.flatGroupList)
    
            // TODO: generate tree view
    
    
            // checkIfAllReourcesHaveSubfolders(path.join(directory, "host_vars"), "host")
            // checkIfAllReourcesHaveSubfolders(path.join(directory, "group_vars"), "group")
    
            // console.dir(JSON.parse(JSON.stringify(inv.flatGroupList)), {depth: null, colors: true})
            // console.dir(JSON.parse(JSON.stringify(inv.flatHostList)), {depth: null, colors: true})
    
            inventories.push(inv)
            data["hosts"].push.apply(data["hosts"], Object.values(inv.flatHostList))
            data["groups"].push.apply(data["groups"], Object.values(inv.flatGroupList))
        }
    
        data["ui-config"] = config['ui-config']
        data["messages"].push.apply(data["messages"], Message.getAllCreatedMessages())
    
        // console.dir(inventories)
        // console.dir(data["hosts"])
        // console.dir(data["groups"])
        
    
        var targetFile = path.join("webpage", "generated-data", "data.js")
        fs.writeFileSync(targetFile, "var data = " + JSON.stringify(data))
    
        console.log(colorG+"Completed file generation: %s"+colorRst, targetFile)

        return data
    }
}

module.exports = DataGenerator
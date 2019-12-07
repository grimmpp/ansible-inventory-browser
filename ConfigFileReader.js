const path = require('path')
const fs = require('fs')
const YAML = require('yaml')
const Message = require('./Message.js')

class ConfigFileReader {

    static addVariablesFromFolder(inventoryDir, folder, resourceType, resourceList, consumptionFunction){ // baseDir, "host_vars", "host"
        const directoryPath = path.join(inventoryDir, folder);
        const inventory = inventoryDir.split(path.sep).pop()

        // if (verboseLogging) console.log(colorGreen+ "Start parsing:" +colorReset+ " '%s' for inventory %s", directoryPath, inventory)

        if( !(fs.existsSync(directoryPath)) ) {
            Message.create("warning", "folder structure", folder, inventory, "Folder '"+folder+"' does not exit!")
            return
        }
        
        fs.readdirSync(directoryPath).forEach(function(subfolder) {
            
            if (!(fs.lstatSync(path.join(directoryPath, subfolder)).isDirectory())) {
                Message.create("error", "folder structure", folder, inventory, "File '"+subfolder+"' should be a directory in '"+folder+"'!")
                return
            }
            
            if (!(subfolder in resourceList)) {
                Message.create("exception", resourceType, subfolder, inventory, "Found folder for "+resourceType+" '"+subfolder+"' which is not entered in hosts file.")
                if (!(consumptionFunction(subfolder))) return
            }

            fs.readdirSync(path.join(directoryPath, subfolder)).forEach(function(yamlFile) {
                try {
                    ConfigFileReader.addConfigSection(directoryPath, subfolder, yamlFile, resourceType, resourceList)
                } catch(e) {
                    var details = "Error occurred in directory: " + path.join(directoryPath, subfolder, yamlFile) + "\n" + e
                    Message.create("exception", resourceType, subfolder, inventory, details)
                }
            });
        });
    }

    static addConfigSection(baseDir, subfolder, yamlFile, resourceType, resourceList) {
        const yamlFullFilename = path.join(baseDir, subfolder, yamlFile)
        const sectionName = path.parse(yamlFile).name
        const inventory = baseDir.split(path.sep).pop()
    
        if (fs.existsSync(yamlFullFilename)) {
            const fileContent = fs.readFileSync(yamlFullFilename, 'utf8')
            resourceList[subfolder]["variables"][sectionName] = YAML.parse(fileContent)
        } else {
            Message.create("error", resourceType, subfolder, inventory,
                resourceType.charAt(0).toUpperCase() + resourceType.slice(1) +" '"+subfolder+"' has no directory '"+sectionName+"'!")
        }
    }

}

module.exports = ConfigFileReader
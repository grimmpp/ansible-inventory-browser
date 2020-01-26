const path = require('path')
const fs = require('fs')
const loadIniFile = require('read-ini-file')
const YAML = require('yaml')
const ConfigFileReader = require('./ConfigFileReader.js')
const Group = require('./Group.js')

class Host {
    constructor(inventory, environment, hostname, group = "ungrouped") {
        this.type = "host"
        this.name = hostname
        this.groups = [ Group.normalizeGroupName(group) ]
        this.inventory = inventory
        this.environment_label = environment
        this.variables = {}
        this.findStr = inventory+';'+this.type+';'+this.name
    }

    static generateHostListFromIniFile(inventory) {
        const hostsIni = loadIniFile.sync( path.join(inventory.filenameFullPath) )
        var hostList = {}

        for (var groupName in hostsIni) {
            if (Group.hasHosts(groupName)) {
                // add all hosts in that group
                for(var hostname in hostsIni[groupName]) {
                    if (Host.isValidHostname(hostname)) {
                        // add host if not exists
                        if (hostList[hostname] === undefined) {
                            hostList[hostname] = new Host(inventory.name, inventory.env, hostname, groupName)
                        }

                        // add additional group
                        if (!(Host.containsGroupName(hostList[hostname], groupName))) {
                            hostList[hostname].groups.push( Group.normalizeGroupName( groupName ))
                        }
                    }

                    // check if there are variables for the host within the host ini-file as section
                    if (Host.isValidHostname(hostname)) {
                        if (hostsIni[groupName+':vars'] !== undefined) {
                            for (var variable in hostsIni[groupName+':vars']){
                                hostList[hostname].variables[variable] = hostsIni[groupName+':vars'][variable]
                            }
                        }
                    }
                    // host + found configuration in the same line
                    // e.g. 'host2 http_port=303 maxRequestsPerChild=909' will be read as hostname = 'host2 http_port' and '303 maxRequestsPerChild=909'
                    else {
                        var _hostname = this.getHostnameOutOfConfigPart(hostname)
                        if (hostList[_hostname] === undefined) {
                            hostList[_hostname] = new Host(inventory.name, inventory.env, _hostname, groupName)
                        }

                        // get variables out of the same line like the host name
                        var varsString = Host.removeHostnameOfVariables(hostname +"="+ hostsIni[groupName][hostname])
                        var splittedVars = Host.internal_splitKeyValueVariablePairs(varsString)

                        for(var i in splittedVars) {
                            var keyValuePair = splittedVars[i].split('=')
                            //remove quotes from start and end
                            if (keyValuePair[1].startsWith('"') && keyValuePair[1].endsWith('"')) keyValuePair[1] = keyValuePair[1].substring(1, keyValuePair[1].length-1)
                            hostList[_hostname].variables[keyValuePair[0]] = keyValuePair[1]
                        }
                    }
                }
            }
        }

        // add variables and configuration from subfolder host_vars
        Host.internal_addVariablesFromFolder(inventory, hostList)

        // console.log("Host List: ")
        // console.dir(JSON.parse(JSON.stringify(hostList)), {depth: null, colors: true})
        return hostList
    }

    static internal_splitKeyValueVariablePairs(variables) {
        var splittedVars = variables.match(/(?:[^\s"]+|"[^"]*")+/g).filter(e => e.length > 0)
        return splittedVars
    }

    static generateHostListFromYamlFile(inventory) {
        const hostsyaml = YAML.parse(  fs.readFileSync(inventory.filenameFullPath, 'utf8') )
        var hostList = {}

        Host.internal_generateHostListFromYamlFile(hostsyaml, inventory, hostList)

        // add variables and configuration from subfolder host_vars
        Host.internal_addVariablesFromFolder(inventory, hostList)

        // console.log("Host List from Yaml: ")
        // console.dir(JSON.parse(JSON.stringify(hostList)), {depth: null, colors: true})
        return hostList
    }
    
    static internal_generateHostListFromYamlFile(hostsyaml, inventory, hostList) {
        for (var groupName in hostsyaml) {

            if (hostsyaml[groupName] != null) {
                if (hostsyaml[groupName]["children"] != undefined) {
                    for(var subGroupName in hostsyaml[groupName]["children"]) {
                        Host.internal_generateHostListFromYamlFile(hostsyaml[groupName]["children"], inventory, hostList)
                    }
                }
                
                if (hostsyaml[groupName]["hosts"] !== undefined) {

                    for(var hostname in hostsyaml[groupName]["hosts"]) {
                        // add host
                        if (hostList[hostname] === undefined) {
                            hostList[hostname] = new Host(inventory.name, inventory.env, hostname, groupName)
                        }

                        // add group
                        if (!(Host.containsGroupName(hostList[hostname], groupName))) {
                            hostList[hostname].groups.push(groupName)
                        }

                        // add variables
                        for (var variable in hostsyaml[groupName]["hosts"][hostname]) {
                            hostList[hostname].variables[variable] = hostsyaml[groupName]["hosts"][hostname][variable]
                        }
                    }
                }
            }
        }

        return hostList
    }

    static internal_addVariablesFromFolder(inventory, hostList) {
        var addUngroupedHosts = function(folderName) { hostList[folderName] = new Host(inventory.name, inventory.env, folderName); return true }

        ConfigFileReader.addVariablesFromFolder(inventory.dir, "host_vars", "host", hostList, addUngroupedHosts)
    }

    // TODO: remove ???
    static addConfigFromHostVarsDir(inventoryDir, hostList) {

    }

    static containsGroupName(host, groupName) {
        return host.groups.includes( Group.normalizeGroupName(groupName) )
    }

    static getHostnameOutOfConfigPart(hostname) {
        return hostname.substring(0, hostname.indexOf(' '))
    }

    static removeHostnameOfVariables(variables) {
        return variables.substring(variables.indexOf(' ')+1)
    }

    static isValidHostname(hostname) {
        return hostname.indexOf(' ') == -1
    }
}

module.exports = Host
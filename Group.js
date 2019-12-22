const path = require('path')
const fs = require('fs')
const loadIniFile = require('read-ini-file')
const YAML = require('yaml')
const ConfigFileReader = require('./ConfigFileReader.js')
const Message = require('./Message.js')

class Group {
    constructor(inventory, environment, originalName) {
        this.type = 'group'
        this.name = Group.normalizeGroupName(originalName)
        this.hostnames = []
        this.host_count = function() { return this.hosts.length }
        this.subgroups = []
        this.group_count = function() {return this.subgroups.length }
        this.inventory = inventory
        this.environment_label = environment
        this.variables = {}
    }

    static hasHosts(groupName) {
        return groupName.indexOf(':') == -1
    }

    static hasSubgroups(groupName) {
        return groupName.indexOf(':children') > -1
    }

    static normalizeGroupName(groupNameFromIniFile) {
        if(groupNameFromIniFile.indexOf(':') == -1) return groupNameFromIniFile
        else return groupNameFromIniFile.substr(0, groupNameFromIniFile.indexOf(':'))
    }

    static hasGroupVariables(groupName) {
        return groupName.indexOf(':vars') > -1
    }

    static isChildOfAnyGroup(groupName, groupList) {
        for(var gn in groupList) {
            if (groupList[gn].subgroups.includes(groupName)) return true
        }
        return false
    }

    // This method generates a flat list of all groups from the hosts ini-file. 
    // All configuration and variables will be parsed and attached.
    static generateFlatGroupListFromIniFile(inventoryDir, environment) {
        const inventory = inventoryDir.split(path.sep).pop()
        const hostsIni = loadIniFile.sync( path.join(inventoryDir, 'hosts') )
        var groupList = {}
    
        for (var groupName in hostsIni) {
            var _groupName = Group.normalizeGroupName(groupName)
    
            if (groupList[_groupName] === undefined) {
                groupList[_groupName] = new Group(inventory, environment, groupName)
            }
    
            if (Group.hasHosts(groupName)) {
                // add hostnames
                for(var hostname in hostsIni[groupName]) {
                    groupList[_groupName].hostnames.push(hostname.split(' ')[0])
                }
            }
            else if (Group.hasSubgroups(groupName)) {
                // add subgroups
                for(var subGroupName in hostsIni[groupName]) {
                    groupList[_groupName].subgroups.push(subGroupName)
                    // need to add goups here as well because they may be listed only as subgroups
                    if (groupList[subGroupName] === undefined) {
                        groupList[subGroupName] = new Group(inventory, environment, subGroupName)
                    }
                }
            } else if (Group.hasGroupVariables(groupName)) {
                // add variables from the hosts ini-file
                for (var varName in hostsIni[groupName]) {
                    groupList[_groupName].variables[varName] = hostsIni[groupName][varName]
                }
            } else {
                console.log("During generation of flat group list, group '%s' could not be considered!", groupName)
            }
        }

        // add variables and configuration from subfolder group_vars
        Group.internal_addVariablesFromFolder(inventoryDir, environment, groupList)

        Group.internal_addGroupAllIfNotExist(inventory, environment, groupList)

        Group.internal_addGroupUngroupedIfNotExist(inventoryDir, environment, groupList)
    
        // console.log("Flat Group List: ")
        // console.dir(JSON.parse(JSON.stringify(groupList)), {depth: null, colors: true})
        return groupList
    }

    // This method generates a flat list of all groups from the hosts yaml-file. 
    // All configuration and variables will be parsed and attached.
    static generateFlatGroupListFromYamlFile(inventoryDir, environment) {
        const inventory = inventoryDir.split(path.sep).pop()
        const yamlFullFilename = path.join(inventoryDir, 'hosts')
        const hostsyaml = YAML.parse(  fs.readFileSync(yamlFullFilename, 'utf8') )
        var groupList = {}

        Group.internal_generateFlatGroupListFromYamlFile(hostsyaml, inventory, environment, groupList)

        Group.internal_addGroupAllIfNotExist(inventory, environment, groupList)

        Group.internal_addGroupUngroupedIfNotExist(inventoryDir, environment, groupList)
        
        // console.log("Flat Group List from yaml: ")
        // console.dir(JSON.parse(JSON.stringify(groupList)), {depth: null, colors: true})
        return groupList
    }

    static internal_generateFlatGroupListFromYamlFile(hostsyaml, inventory, environment, groupList) {

        for (var groupName in hostsyaml) {

            // add group if not exits
            if (groupList[groupName] === undefined) {
                groupList[groupName] = new Group(inventory, environment, groupName)
            }

            if (hostsyaml[groupName] != null) {
                // add subgroups
                if (hostsyaml[groupName]["children"] != undefined) {
                    for(var subGroupName in hostsyaml[groupName]["children"]) {
                        if (!(groupList[groupName].subgroups.includes(subGroupName))) {
                            groupList[groupName].subgroups.push(subGroupName)
                        }
                        Group.internal_generateFlatGroupListFromYamlFile(hostsyaml[groupName]["children"], inventory, environment, groupList)
                    }
                }

                // add variables from the hosts yaml-file
                if (hostsyaml[groupName]["vars"] !== undefined) {
                    for (var varName in hostsyaml[groupName]["vars"]) {
                        groupList[groupName].variables[varName] = hostsyaml[groupName]["vars"][varName]
                    }
                }

                // add hostnames
                if (hostsyaml[groupName]["hosts"] !== undefined) {
                    for(var hostname in hostsyaml[groupName]["hosts"]) {
                        if (!(groupList[groupName].hostnames.includes(hostname))) {
                            groupList[groupName].hostnames.push(hostname)
                        }
                    }
                }
            }
        }

        return groupList
    }

    static internal_addVariablesFromFolder(inventoryDir, environment, groupList) {
        const inventory = inventoryDir.split(path.sep).pop()
        var addUnknownGroup = function(folderName) { groupList[folderName] = new Group(inventory, environment, folderName); return true }

        ConfigFileReader.addVariablesFromFolder(inventoryDir, "group_vars", "group", groupList, addUnknownGroup)
    }

    static internal_addGroupAllIfNotExist(inventory, environment, groupList) {
        if (groupList['all'] === undefined) {
            groupList['all'] = new Group(inventory, environment, 'all')
        }

        // add all subgroups
        for (var gn in groupList) {
            // ignore top level groups
            if (gn != 'all' && gn != 'ungrouped') {
                if( !(Group.isChildOfAnyGroup(gn, groupList)) ) {
                    if (!(groupList['all'].subgroups.includes(gn))) {
                        groupList['all'].subgroups.push(gn)
                    }
                }
            }
        }
    }

    static internal_addGroupUngroupedIfNotExist(inventoryDir, environment, groupList) {
        const inventory = inventoryDir.split(path.sep).pop()

        if (groupList['ungrouped'] === undefined) {
            groupList['ungrouped'] = new Group(inventory, environment, 'ungrouped')
        }

        // find hosts which are not in a group
        const directoryPath = path.join(inventoryDir, 'host_vars');
        if( fs.existsSync(directoryPath)) {
            fs.readdirSync(directoryPath).forEach(function(hostname) {
                if (fs.lstatSync(path.join(directoryPath, hostname)).isDirectory()) {
                    // is host in group
                    for (var gn in groupList) {
                        if (!(Group.isHostnameContainedInAnyGroup(hostname, groupList))) {
                            groupList['ungrouped'].hostnames.push(hostname)
                        }
                    }
                } else {
                    Message.create("warning", "folder structure", hostname, inventory, "Ignore file '"+hostname+"' in 'host_vars'!")
                }
            })
        }
    }

    static getHostnameListByGroupName(flatHostList, groupName) {
        var hostnameList = []
        var groupsToBeConsidered = [ groupName ]

        while(groupsToBeConsidered.length > 0) {
            var nextGroupName = groupsToBeConsidered.shift()
            if (flatHostList[nextGroupName] !== undefined ) {
                hostnameList.push(...flatHostList[nextGroupName].hostnames)
                groupsToBeConsidered.push(...flatHostList[nextGroupName].subgroups)
            }
        }

        // console.log("Hostname List of Group '%s': ",groupName)
        // console.dir(JSON.parse(JSON.stringify(hostnameList)), {depth: null, colors: true})
        return hostnameList
    }

    static isHostnameContainedInAnyGroup(hostname, groupList) {
        for(var gn in groupList) {
            if (groupList[gn].hostnames.includes(hostname)) return true
        }
        return false
    }

    static isValidHostname(hostname) {
        return hostname.indexOf(' ') == -1
    }
}

module.exports = Group
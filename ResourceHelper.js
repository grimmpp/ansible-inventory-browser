const Message = require('./Message.js')

class ResourceHelper {

    static addAllShortcuts(inventory) {
        ResourceHelper.addShortcuts(inventory.name, 'host', inventory.shortcutsConfig, inventory.flatHostList)
        ResourceHelper.addShortcuts(inventory.name, 'group', inventory.shortcutsConfig, inventory.flatGroupList)
    }

    static addShortcuts(inventory, resourceType, shortcutConfig, resourceList) {
        for (var resource in resourceList) {
            for(var scIndex in shortcutConfig) {
                if (shortcutConfig[scIndex]['resource-type'] == resourceType) {
                    var scName = shortcutConfig[scIndex]['name']
                    var path = shortcutConfig[scIndex]['path'].split('/')
                    var func = shortcutConfig[scIndex]['function'] === undefined ? 'copy' : shortcutConfig[scIndex]['function']

                    if (resourceList[resource][scName] === undefined) resourceList[resource][scName] = ''
                    var defaultValue = resourceList[resource][scName]

                    if (func == "copy") {
                        resourceList[resource][scName] = ResourceHelper.getProp(inventory, resourceType, resource, resourceList[resource], path, defaultValue)
                    } 
                    else if(func == "count") {
                        resourceList[resource][scName] = ResourceHelper.getProp(inventory, resourceType, resource, resourceList[resource], path, defaultValue).length
                    }
                    else {
                        Message.create("error", resourceType, resource, inventory, "Error: unknown function '"+func+"'")
                    }

                }
            }
        }
    }

    static getProp(inventory, resourceType, resource, obj, propArray, defaultValue = '') {
        try {
            var _obj = obj
            propArray.forEach(prop => {
                _obj = _obj[prop]
            });
            if (_obj===undefined) _obj=""
            return _obj
        } catch (e) {
            Message.create("warning", resourceType, resource, inventory, "Resource '"+resource+"' has no property: "+JSON.stringify(propArray) )
            return ""
        }
    }

}

module.exports = ResourceHelper
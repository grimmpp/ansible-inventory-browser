const Message = require('./Message.js')

class ResourceHelper {

    static addAllShortcuts(inventory) {
        ResourceHelper.addShortcuts(inventory.name, 'host', inventory.shortcutsConfig, inventory.flatHostList)
        ResourceHelper.addShortcuts(inventory.name, 'group', inventory.shortcutsConfig, inventory.flatGroupList)
    }

    static addShortcuts(inventoryName, resourceType, shortcutConfig, resourceList) {
        for (var resource in resourceList) {
            for(var scIndex in shortcutConfig) {
                if (shortcutConfig[scIndex]['resource-type'] == resourceType || shortcutConfig[scIndex]['resource-type'] == 'all') {
                    var scName = shortcutConfig[scIndex]['name']
                    var path = shortcutConfig[scIndex]['path'].split('/')
                    var func = shortcutConfig[scIndex]['function'] === undefined ? 'copy' : shortcutConfig[scIndex]['function'].toLowerCase()

                    if (func == "copy") {
                        resourceList[resource][scName] = ResourceHelper.getProp(inventoryName, resourceType, resource, resourceList[resource], path)
                    } 
                    else if(func == "count") {
                        resourceList[resource][scName] = ResourceHelper.getProp(inventoryName, resourceType, resource, resourceList[resource], path).length
                    }
                    else if(func == "delete") {
                        ResourceHelper.deletePropertyFromObject(inventoryName, resourceType, resource, resourceList[resource], path)
                    }
                    else {
                        Message.create("error", resourceType, resource, inventoryName, "Error: unknown function '"+func+"'")
                    }

                }
            }
        }
    }

    static getProp(inventoryName, resourceType, resource, obj, propArray, defaultValue = '') {
        try {
            var _obj = obj
            propArray.forEach(prop => {
                _obj = _obj[prop]
            });
            if (_obj===undefined) _obj = defaultValue
            return _obj
        } catch (e) {
            Message.create("warning", resourceType, resource, inventoryName, "Resource '"+resource+"' has no property: "+JSON.stringify(propArray) )
            return defaultValue
        }
    }

    static deletePropertyFromObject(inventoryName, resourceType, resource, obj, propArray, defaultValue='') {
        try {
            var _obj = obj
            for(var i=0; i < propArray.length-1; i++) _obj = _obj[propArray[i]]
            delete _obj[propArray[propArray.length-1]]

        } catch(e) {
            Message.create("warning", resourceType, resource, inventoryName, "Cannot remove property '"+propArray[propArray.length-1]+"' from resource '"+resource+"': "+JSON.stringify(propArray) +"\n"+e )
        }
    }

}

module.exports = ResourceHelper
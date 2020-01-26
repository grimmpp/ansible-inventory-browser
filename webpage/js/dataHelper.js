class DataHelper {

    static getAllInheritedVariablesOfNode(childNode) {
        var node = childNode
        var content = []

        while (node != null) {
            content = DataHelper.getNestedVariables(node, node.variables, content)
            node = DataHelper.findParentNode(node)
        }

        return content
    }

    static getNestedVariables(obj, variables, content=[], prefix='') {
        for (var varName in variables) {
            if (typeof variables[varName] == 'object') {
                DataHelper.getNestedVariables(obj, variables[varName], content, varName+' → ')
            }
            else {
                content.push({
                    name: obj.name,
                    type: obj.type,
                    var_name: prefix+varName,
                    var_val: variables[varName]
                })
            } 
        }

        return content
    }

    static findParentNode(childNode, nodes = data['trees']) {

        for(var i in nodes) {
            var n = nodes[i]
            if (n.nodes !== undefined) {
                if (n.inventory == childNode.inventory) {
                    if (childNode.type == 'host' && n.hostnames.includes(childNode.name)) return n
                    else if (childNode.type == 'group' && n.subgroups.includes(childNode.name)) return n
                    else {
                        var p = DataHelper.findParentNode(childNode, n.nodes)
                        if (p != null) return p
                    }
                }
            }
        }

        return null
    }
}
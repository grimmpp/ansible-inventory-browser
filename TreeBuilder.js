class TreeBuilder {

    static build(flatGroupList, flatHostList) {
        var trees = [] 
        
        for(var i in flatGroupList) {
            if (flatGroupList[i].name == 'all') {
                var node = TreeBuilder._internal_cloneObject(flatGroupList[i])
                TreeBuilder.internal_addSubgroupsToNode(flatGroupList, flatHostList, node)
                trees.push( node )
            }
        }

        return trees
    }

    static internal_addSubgroupsToNode(flatGroupList, flatHostList, node) {
        node.nodes = []
        for (var i in node.subgroups) {
            var subnode = TreeBuilder._internal_cloneObject(TreeBuilder._internal_findSubnode(flatGroupList, node.inventory, node.subgroups[i]))
    
            TreeBuilder.internal_addSubgroupsToNode(flatGroupList, flatHostList, subnode)
            subnode.variables = Object.assign(subnode.variables, node.variables)
            node.nodes.push(subnode)
        }

        for (var i in node.hostnames) {
            var host = TreeBuilder._internal_cloneObject(TreeBuilder._internal_findSubnode(flatHostList, node.inventory, node.hostnames[i]))
            host.variables = Object.assign(host.variables, node.variables)
            node.nodes.push(host)
        }
    }
    
    static _internal_findSubnode(flatGroupList, inventory, subnodeName) {
        return flatGroupList.find(n => n.inventory == inventory && n.name == subnodeName)
    }

    static _internal_cloneObject(obj) {
        return JSON.parse(JSON.stringify(obj))
    }
}

module.exports = TreeBuilder
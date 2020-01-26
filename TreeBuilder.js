class TreeBuilder {

    static build(flatGroupList, flatHostList) {
        var trees = [] 
        
        for(var i in flatGroupList) {
            if (flatGroupList[i].name == 'all' || flatGroupList[i].name == 'ungrouped') {
                var node = flatGroupList[i]
                TreeBuilder.internal_addSubgroupsToNode(flatGroupList, flatHostList, node)
                trees.push( node )
            }
        }

        TreeBuilder.internal_sortRootNodes(trees)

        return trees
    }

    static internal_addSubgroupsToNode(flatGroupList, flatHostList, node) {

        node.nodes = []
        for (var i in node.subgroups) {
            var subnode = TreeBuilder._internal_findSubnode(flatGroupList, node.inventory, node.subgroups[i])
            // inherit variables
            // subnode.variables = Object.assign(subnode.variables, node.variables)
            node.nodes.push(subnode)
            TreeBuilder.internal_addSubgroupsToNode(flatGroupList, flatHostList, subnode)
        }

        for (var i in node.hostnames) {
            // do not copy host entries because the same host can appear in different subtrees and we want to get all vars inherited. 
            // Futhermore the hosts in the host list will get the vars as well.
            var host = TreeBuilder._internal_findSubnode(flatHostList, node.inventory, node.hostnames[i])
            // inherit variables
            // host.variables = Object.assign(host.variables, node.variables)
            node.nodes.push(host)
        }
    }
    
    static _internal_findSubnode(nodeList, inventory, subnodeName) {
        var result = nodeList.find(n => n.inventory == inventory && n.name == subnodeName)
        return result
    }

    static _internal_cloneObject(obj) {
        var node = JSON.parse(JSON.stringify(obj))
        return node
    }

    static internal_sortRootNodes(trees){

        for(var i=0; i<trees.length; i+=2) {
            if (trees[i].name != 'all') {
                var temp = trees[i]
                trees[i] = trees[i+1]
                trees[i+1] = temp
            }
        }
    }
}

module.exports = TreeBuilder
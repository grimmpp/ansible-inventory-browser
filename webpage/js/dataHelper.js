    class DataHelper {

        static initData(){
            DataHelper.initTreeList()
            DataHelper.initGlobalHostsList()
        }

        static initTreeList() {
            data['trees'] = []
            data['inventories'].forEach(inv => {
                inv['tree'].forEach(n => data['trees'].push(n))
            })
        }

        static initGlobalHostsList() {
            data['hosts'] = []
            data['trees'].forEach(n => DataHelper.addHostToList(n, data['hosts']) )
        }

        static addHostToList(treeNode, list){
            if (treeNode.type == 'host') list.push(treeNode)
            else {
                if (treeNode.nodes !== undefined) treeNode.nodes.forEach(n => DataHelper.addHostToList(n, list) )
            }
        }

        static getAllInheritedVariableListOfNode(childNode) {
            var node = childNode
            var content = []

            while (node != null) {
                content = DataHelper.getNestedVariablesAsList(node, node.variables, content)
                node = DataHelper.findParentNode(node)
            }

            return content
        }

        static getNestedVariablesAsList(obj, variables, content=[], prefix='') {
            for (var varName in variables) {
                if (typeof variables[varName] == 'object') {
                    DataHelper.getNestedVariablesAsList(obj, variables[varName], content, prefix + varName+' → ')
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

        static getAllInheritedVariableTreeOfNode(childNode) {
            var node = childNode
            var tree = []

            while (node != null) {
                DataHelper.getNestedVariablesAsTree(node, node.variables, tree)
                node = DataHelper.findParentNode(node)
            }

            return tree
        }

        static getNestedVariablesAsTree(obj, variables, subNodeList) {
            for (var varName in variables) {
                var node = {name: obj.name, type: obj.type, var_name: varName, var_val: '', nodes: [] }
                if (typeof variables[varName] == 'object') {
                    DataHelper.getNestedVariablesAsTree(obj, variables[varName], node.nodes)
                }
                else {
                    node.var_val = variables[varName]
                }
                subNodeList.push(node)
            }
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
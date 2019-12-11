const chai = require('chai')
const expect = chai.expect

const DataGenerator = require('../DataGenerator.js')


describe('#treeBuilderTest()', function() {
    
    var inventoryFile = "./inventory.conf"
    var data ={}

    before(function() {
        data = DataGenerator.parseInventoriesAndGenerateData(inventoryFile)
    })
  
    it('check trees', function() {
        const inventoryCount = data['groups'].map(g => g.inventory).filter((v, i, a) => a.indexOf(v) === i).length
        expect( data['trees'] ).not.undefined
        expect( data['trees'].length ).to.equal( inventoryCount * 2 )
    })

    it('check root nodes', function() {
        var listOfRootNodeNames = data['trees'].map(root => root.name).filter((v, i, a) => a.indexOf(v) === i)
        expect( listOfRootNodeNames ).not.undefined
        expect( listOfRootNodeNames.length ).to.equal(2)
        listOfRootNodeNames.includes('all')
        listOfRootNodeNames.includes('ungrouped')
    })

    it('check inventory1', function() {
        const rootNodeAll = data['trees'].find(n => n.name == 'all' && n.inventory == 'inventory1')
        
        expect( rootNodeAll ).not.undefined
        expect( rootNodeAll.hostnames.length ).to.equal(0)
        expect( rootNodeAll.subgroups.length ).to.equal(1)
        expect( rootNodeAll.nodes.length ).to.equal(1)
        expect( rootNodeAll.subgroups[0] ).to.equal('datacenter')

        var datacenterNode = rootNodeAll.nodes[0]
        expect( datacenterNode ).not.undefined
        expect( datacenterNode.hostnames.length ).to.equal(0)
        expect( datacenterNode.subgroups.length ).to.equal(3)
        expect( datacenterNode.nodes.length ).to.equal(3)
        expect( datacenterNode.subgroups.includes('network') ).to.true
        expect( datacenterNode.subgroups.includes('webservers') ).to.true
        expect( datacenterNode.subgroups.includes('test') ).to.true

        var networkNode = datacenterNode.nodes.find(n => n.name == 'network')
        expect( networkNode ).not.undefined
        expect( networkNode.hostnames.length ).to.equal(0)
        expect( networkNode.subgroups.length ).to.equal(2)
        expect( networkNode.nodes.length ).to.equal(2)
        expect( networkNode.subgroups.includes('leafs') ).to.true
        expect( networkNode.subgroups.includes('spines') ).to.true

        var leafsNode = networkNode.nodes.find(n => n.name == 'leafs')
        expect( leafsNode ).not.undefined
        expect( leafsNode.subgroups.length ).to.equal(0)
        expect( leafsNode.nodes.length ).to.equal(2)
        expect( leafsNode.hostnames.length ).to.equal(2)
        expect( leafsNode.nodes.map(n => n.name).includes('leaf01') ).to.true
        expect( leafsNode.nodes.map(n => n.name).includes('leaf02') ).to.true

        var spinesNode = networkNode.nodes.find(n => n.name == 'spines')
        expect( spinesNode ).not.undefined
        expect( spinesNode.subgroups.length ).to.equal(0)
        expect( spinesNode.nodes.length ).to.equal(2)
        expect( spinesNode.hostnames.length ).to.equal(2)
        expect( spinesNode.nodes.map(n => n.name).includes('spine01') ).to.true
        expect( spinesNode.nodes.map(n => n.name).includes('spine02') ).to.true

        var webserversNode = datacenterNode.nodes.find(n => n.name == 'webservers')
        expect( webserversNode ).not.undefined
        expect( webserversNode.subgroups.length ).to.equal(0)
        expect( webserversNode.nodes.length ).to.equal(2)
        expect( webserversNode.hostnames.length ).to.equal(2)
        expect( webserversNode.nodes.map(n => n.name).includes('webserver01') ).to.true
        expect( webserversNode.nodes.map(n => n.name).includes('webserver02') ).to.true

        var testNode = datacenterNode.nodes.find(n => n.name == 'test')
        expect( testNode ).not.undefined
        expect( testNode.subgroups.length ).to.equal(0)
        expect( testNode.nodes.length ).to.equal(4)
        expect( testNode.hostnames.length ).to.equal(4)
        expect( testNode.nodes.map(n => n.name).includes('leaf01') ).to.true
        expect( testNode.nodes.map(n => n.name).includes('localhost') ).to.true
        expect( testNode.nodes.map(n => n.name).includes('other1.example.com') ).to.true
        expect( testNode.nodes.map(n => n.name).includes('other1.example.com') ).to.true
    })

})
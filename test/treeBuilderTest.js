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
        expect( data['trees'] ).not.undefined
        expect( data['trees'].length ).to.equal(5)
    })

    it('check root nodes', function() {
        var listOfRootNodeNames = data['trees'].map(root => root.name).filter((v, i, a) => a.indexOf(v) === i)
        expect( listOfRootNodeNames ).not.undefined
        expect( listOfRootNodeNames.length ).to.equal(1)
        expect( listOfRootNodeNames[0] ).to.equal('all')
    })

})
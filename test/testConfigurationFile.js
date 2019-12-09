const path = require('path')
const fs = require('fs')
const chai = require('chai')
chai.use(require('chai-arrays'));
chai.use(require('chai-string'));
const expect = chai.expect


describe('#testConfigurationFileValidation()', function() {
    
    var config = {}

    before(function() {
        var inventoryConfigFilename = path.join(".", "inventory.conf")
        config = JSON.parse( fs.readFileSync( inventoryConfigFilename, 'utf8') )
    })
  
    it('check ui-config part', function() {
        // add an assertion
        expect(config).property('ui-config')
        

        var views = ['host-view', 'group-view', 'message-view']
        for (var i in views) {
            // expect(config['ui-config'][views[i]]).not.undefined
            expect(config['ui-config']).property(views[i])
            
            expect(config['ui-config'][views[i]]).property('header')
            expect(config['ui-config'][views[i]]['header']).to.be.array()
            expect(config['ui-config'][views[i]]['header'].length).to.be.above(0)

            expect(config['ui-config'][views[i]]).property('event-type')
            expect(config['ui-config'][views[i]]['event-type']).to.be.a('string')
            expect(config['ui-config'][views[i]]['event-type'].length).to.be.above(0)

            expect(config['ui-config'][views[i]]).property('columns')
            expect(config['ui-config'][views[i]]['columns']).to.be.array()
            expect(config['ui-config'][views[i]]['columns'].length).to.be.above(0)
        }
        
    })
    
  
})
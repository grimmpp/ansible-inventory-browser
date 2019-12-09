const chai = require('chai')
const expect = chai.expect

const DataGenerator = require('../DataGenerator.js')


describe('#inventoryTest()', function() {
    
    var inventoryFile = "./inventory.conf"
    var data ={}

    before(function() {
        data = DataGenerator.parseInventoriesAndGenerateData(inventoryFile)
    })
  
    it('check flat host list', function() {
        const hostCount = 32
        expect(data).property('hosts')
        expect(data['hosts'].length).to.equal(hostCount)
    })

    it('check flat group list', function() {
        const groupCount = 36
        expect(data).property('groups')
        expect(data['groups'].length).to.equal(groupCount)
    })

    it('check inventories', function() {
        const inventoryCount = 5

        var inventories = data['hosts'].map(h => h.inventory).filter((v, i, a) => a.indexOf(v) === i)
        expect(inventories.length).to.equal(inventoryCount)

        var inventories = data['groups'].map(h => h.inventory).filter((v, i, a) => a.indexOf(v) === i)
        expect(inventories.length).to.equal(inventoryCount)
    })

    it('check hosts for inventory1', function() {
        const hostCount = 9
        var hosts = data['hosts'].filter(h => h.inventory == 'inventory1')
        expect(hosts.length).to.equal(hostCount)

        const hostnames = ['leaf01','leaf02','spine01','spine01','webserver01','webserver02','localhost','other1.example.com','other2.example.com']
        for(var i in hostnames) {
            expect( hosts.map(h => h.name).includes(hostnames[i]) ).to.be.true
        }

        expect( Object.keys(hosts.find(h => h.name == 'localhost').variables).length ).to.equal(1)
        expect( hosts.find(h => h.name == 'localhost').variables['ansible_connection'] ).to.equal('local')
        expect( Object.keys(hosts.find(h => h.name == 'other1.example.com').variables).length ).to.equal(2)
        expect( hosts.find(h => h.name == 'other1.example.com').variables['ansible_connection'] ).to.equal('ssh')
        expect( hosts.find(h => h.name == 'other1.example.com').variables['ansible_user'] ).to.equal('myuser')
        expect( Object.keys(hosts.find(h => h.name == 'other2.example.com').variables).length ).to.equal(2)
        expect( hosts.find(h => h.name == 'other2.example.com').variables['ansible_connection'] ).to.equal('ssh')
        expect( hosts.find(h => h.name == 'other2.example.com').variables['ansible_user'] ).to.equal('myotheruser')
    })

    it('check groups for inventory1', function() {
        const groupCount = 8
        var groups = data['groups'].filter(h => h.inventory == 'inventory1')
        expect(groups.length).to.equal(groupCount)

        const groupnames = ['ungrouped','leafs','spines','network','webservers','datacenter','test','all']
        for(var i in groupnames) {
            expect( groups.map(g => g.name).includes(groupnames[i]) ).to.be.true
        }
    })
})
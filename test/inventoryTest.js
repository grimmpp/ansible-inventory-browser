const chai = require('chai')
const expect = chai.expect

const DataGenerator = require('../DataGenerator.js')


describe('#inventoryTest()', function() {
    
    function findHostByName(hosts, hostname) {
        return hosts.find(h => h.name == hostname)
    }

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
        const groupCount = 39
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
        const inventoryName = 'inventory1'
        const envName = 'env1'
        var hosts = data['hosts'].filter(h => h.inventory == inventoryName)
        expect(hosts.length).to.equal(hostCount)

        const hostnames = ['leaf01','leaf02','spine01','spine01','webserver01','webserver02','localhost','other1.example.com','other2.example.com']
        for(var i in hostnames) {
            var host = findHostByName(hosts, hostnames[i])
            expect( host ).not.undefined
            
            expect( host ).property('environment_label')
            expect( host.environment_label ).to.equal(envName)

            expect( host ).property('inventory')
            expect( host.inventory ).to.equal(inventoryName)

            expect( hosts.map(h => h.name).includes(hostnames[i]) ).to.be.true
        }

        var host = findHostByName(hosts, 'localhost')
        expect( Object.keys( host.variables).length ).to.equal(1)
        expect( host.variables['ansible_connection'] ).to.equal('local')

        host = findHostByName(hosts, 'other1.example.com')
        expect( Object.keys( host.variables).length ).to.equal(2)
        expect( host.variables['ansible_connection'] ).to.equal('ssh')
        expect( host.variables['ansible_user'] ).to.equal('myuser')

        host = findHostByName(hosts, 'other2.example.com')
        expect( Object.keys( host.variables).length ).to.equal(2)
        expect( host.variables['ansible_connection'] ).to.equal('ssh')
        expect( host.variables['ansible_user'] ).to.equal('myotheruser')

        const hostsWithoutVariables = ['leaf01','leaf02','spine01','spine01','webserver01','webserver02']
        for(var i in hostsWithoutVariables) {
            host = findHostByName(hosts, hostsWithoutVariables[i])
            console.dir(host)
            expect( Object.keys( host.variables ).length ).to.equal(0)
        }
    })

    it('check groups for inventory1', function() {
        const groupCount = 8
        const inventoryName = 'inventory1'
        
        var groups = data['groups'].filter(h => h.inventory == inventoryName)
        expect(groups.length).to.equal(groupCount)

        const groupnames = ['ungrouped','leafs','spines','network','webservers','datacenter','test','all']
        expect( groupnames.length ).to.equal(groupCount)
        for(var i in groupnames) {
            expect( groups.map(g => g.name).includes(groupnames[i]) ).to.be.true
        }

        const emptySubgroups = ['ungrouped','leafs','spines','webservers','test']
        for(var i in emptySubgroups) {
            expect( groups.find(g => g.name == emptySubgroups[i]).subgroups.length ).to.equal(0)
        }

        const parentGroups = ['all','datacenter','network']
        for(var i in parentGroups) {
            expect( groups.find(g => g.name == parentGroups[i]).subgroups.length ).greaterThan(0)
        }

        expect( emptySubgroups.length + parentGroups.length ).to.equal(groupCount)
    })

    it('check hosts for inventory2', function() {
        const hostCount = 4
        const inventoryName = 'inventory2'
        const envName = 'env2'
        var hosts = data['hosts'].filter(h => h.inventory == inventoryName)
        expect(hosts.length).to.equal(hostCount)

        const hostnames = ['host1','host2','host3','jumper']
        for(var i in hostnames) {
            var host = findHostByName(hosts, hostnames[i])
            expect( host ).not.undefined
            
            expect( host ).property('environment_label')
            expect( host.environment_label ).to.equal(envName)

            expect( host ).property('inventory')
            expect( host.inventory ).to.equal(inventoryName)

            expect( hosts.map(h => h.name).includes(hostnames[i]) ).to.be.true
        }

        var host = findHostByName(hosts, 'host1')
        expect( Object.keys( host.variables).length ).to.equal(9) // incl. group vars
        expect( host.variables['http_port'] ).to.equal('80')
        expect( host.variables['maxRequestsPerChild'] ).to.equal('808')
        expect( host.variables['ssh_port'] ).to.equal('22')

        host = findHostByName(hosts, 'host2')
        expect( Object.keys( host.variables).length ).to.equal(8) // incl. group vars
        expect( host.variables['http_port'] ).to.equal('303')
        expect( host.variables['maxRequestsPerChild'] ).to.equal('909')

        host = findHostByName(hosts, 'host3')
        expect( Object.keys( host.variables).length ).to.equal(4)    // incl. group vars

        host = findHostByName(hosts, 'jumper')
        expect( Object.keys( host.variables).length ).to.equal(6)    // incl. group vars
        expect( host.variables['ansible_port'] ).to.equal('5555')
        expect( host.variables['ansible_host'] ).to.equal('192.0.2.50')

        const hostsWithoutVariables = ['host3']
        for(var i in hostsWithoutVariables) {
            host = findHostByName(hosts, hostsWithoutVariables[i])
            expect( Object.keys( host.variables ).length ).to.equal(4)   // 4 group vars
        }
    })

    it('check groups for inventory2', function() {
        const groupCount = 9
        const inventoryName = 'inventory2'
        
        var groups = data['groups'].filter(h => h.inventory == inventoryName)
        expect(groups.length).to.equal(groupCount)

        const groupnames = ['atlanta', 'raleigh', 'southeast', 'usa', 'northeast', 'southwest', 'northwest', 'all', 'ungrouped']
        expect( groupnames.length ).to.equal(groupCount)
        for(var i in groupnames) {
            expect( groups.map(g => g.name).includes(groupnames[i]) ).to.be.true
        }
        expect( groups.find(g => g.name == 'atlanta').hostnames.includes('host1') ).to.be.true
        expect( groups.find(g => g.name == 'atlanta').hostnames.includes('host2') ).to.be.true

        const emptySubgroups = ['atlanta', 'raleigh', 'northeast', 'southwest', 'northwest', 'ungrouped']
        for(var i in emptySubgroups) {
            expect( groups.find(g => g.name == emptySubgroups[i]).subgroups.length ).to.equal(0)
        }
        const parentGroups = ['all','usa','southeast']
        for(var i in parentGroups) {
            expect( groups.find(g => g.name == parentGroups[i]).subgroups.length ).greaterThan(0)
        }

        expect( emptySubgroups.length + parentGroups.length ).to.equal(groupCount)
    })

    it('check host2 in inventory3', function() {
        const inventoryName = 'inventory3'
        const hostName = 'host2'
        var host2 = data['hosts'].find(h => h.inventory == inventoryName && h.name == hostName)
        
        expect( host2.groups.length ).to.equal(2)
        expect( host2.groups.includes('atlanta') ).to.true
        expect( host2.groups.includes('raleigh') ).to.true

        // check inherited vars
        expect( Object.keys(host2.variables).length ).to.equal(6)
        expect( host2.variables['atlanta_group_info'] ).to.equal(42)
        expect( host2.variables['raleigh_group_info'] ).to.equal(84)

        var groupAtlanta = data['groups'].find(h => h.inventory == inventoryName && h.name == 'atlanta')
        expect( groupAtlanta.variables['atlanta_group_info'] ).to.equal(42)
        expect( Object.keys(groupAtlanta.variables).length ).to.equal(1)

        var groupRaleigh = data['groups'].find(h => h.inventory == inventoryName && h.name == 'raleigh')
        expect( Object.keys(groupRaleigh.variables).length ).to.equal(1)
        expect( groupRaleigh.variables['raleigh_group_info'] ).to.equal(84)

    })
})
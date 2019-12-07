const path = require('path')

class Inventory {
    constructor(config) {
        this.name = config.dir.split(path.sep).pop()
        this.dir = path.join( config.dir )
        this.env = config.env
        this.hostsFileFormat = config['hosts-file-format'] === undefined ? 'ini' : config['hosts-file-format']
        this.shortcutsConfig = config['shortcuts']

        this.flatHostList = {}
        this.flatGroupList = {}
    }

    isIniHostsFileFormat() {
        return this.hostsFileFormat === undefined || this.hostsFileFormat.toLowerCase() == 'ini'
    }

    isYamlHostsFileFormat() {
        if (this.hostsFileFormat === undefined) return false
        return this.hostsFileFormat.toLowerCase() == 'yaml' || this.hostsFileFormat.toLowerCase() == 'yml'
    }
}

module.exports = Inventory
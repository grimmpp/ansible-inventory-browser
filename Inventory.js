const path = require('path')

class Inventory {
    constructor(config) {
        this.filenameFullPath = config['hosts-file']
        this.filename = path.basename(this.filenameFullPath)
        this.dir = path.dirname(this.filenameFullPath)
        this.name = this.dir.split('/').pop()
        this.env = config.env
        this.hostsFileFormat = path.extname(this.filename).length == 0 ? 'ini' : this.filename.split('.').pop()
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
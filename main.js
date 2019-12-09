'use strict'
const yargs = require('yargs')
const path = require('path')

const Message = require('./Message.js')
const DataGenerator = require('./DataGenerator.js')

const colorG = "\x1b[32m"
const colorB = "\x1b[34m"
const colorR = "\x1b[31m"
const colorRst = "\x1b[0m"

const argv = yargs
    .option('verbose', {
        alias: 'v',
        describe: 'Enable detailed logging'
    })
    .option('configFile', {
        alias: 'c',
        type: 'string',
        describe: 'Path to config file. Default file is ./inventory.conf'
    })
    .help()
    .alias('help', 'h')
    .argv


if(argv['verbose']) Message.enableLogging()
var inventoryConfigFilename = path.join(".", "inventory.conf")
if (argv["configFile"]) inventoryConfigFilename = argv["configFile"]


DataGenerator.parseInventoriesAndGenerateData(inventoryConfigFilename)

if (!(Message.isLoggingEnabled())) console.log("Message Count: "+Message.getAllCreatedMessages().length)
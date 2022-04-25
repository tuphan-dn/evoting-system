// copyIdl.js
const fs = require('fs')
const idl = require('./target/idl/l6.json')

fs.writeFileSync('./app/src/idl.json', JSON.stringify(idl))

var errors = require('./errors.js')
var table = require('markdown-table')
var path = require('path')
var fs = require('fs')
var outputFile = path.join('docs', 'errors.md')
var json = [['Error Code', 'Message']]
var codes = errors.codes
Object.keys(codes).forEach(function (code) {
  json.push([codes[code].code, codes[code].defaultMessage])
})
fs.writeFile(outputFile, table(json))

module.exports = function generateDocs (errors, destinationFile, callback) {
	var table = require('markdown-table')
	var path = require('path')
	var fs = require('fs')
	var json = [['Error Code', 'Message']]
	var codes = errors.codes
	Object.keys(codes).forEach(function (code) {
	  json.push([codes[code].code, codes[code].defaultMessage])
	})
	fs.writeFile(destinationFile, table(json), callback)
}

var errors = require('errors')
var originalCreate = errors.create
errors.codes = exports.codes = {}
errors.create = function (options) {
  // make 'code' and 'name' mandatory
  if (!options.name) throw new Error('Must specify name')
  if (!options.defaultMessage) throw new Error('Must specify defaultMessage')
  if (!options.code) throw new Error('Must specify code')
  if (typeof options.code !== 'number') throw new Error('code must be a number')
  if (errors.find(options.code)) throw new Error('code already exists')
  errors.codes[options.code] = options
  return originalCreate(options)
}

// validation errors

errors.create({
  name: 'InvalidAddressError',
  code: 10001,
  status: 422,
  defaultMessage: 'Invalid Address'
})

errors.create({
  name: 'InvalidAssetIdError',
  code: 10002,
  status: 422,
  defaultMessage: 'Invalid Asset ID'
})

errors.create({
  name: 'InvalidTxidError',
  code: 10003,
  status: 422,
  defaultMessage: 'Invalid Transaction ID'
})

module.exports = errors

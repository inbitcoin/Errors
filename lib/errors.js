var errors = require('errors')
var originalCreate = errors.create
errors.codes = exports.codes = {}

// ColoredCoins base error (all errors will inherit from it)
errors.create({
  name: 'ColoredCoinsError'
})

errors.create = function (options) {
  // make 'code' and 'name' mandatory
  if (!options.name) throw new Error('Must specify name')
  if (!options.code) throw new Error('Must specify code')
  if (typeof options.code !== 'number') throw new Error('code must be a number')
  if (errors.find(options.code)) throw new Error('code already exists')
  options.parent = options.parent || errors.ColoredCoinsError
  errors.codes[options.code] = options
  return originalCreate(options)
}

// validation errors

errors.create({
  name: 'InvalidAddressError',
  code: 10001,
  status: 422,
  defaultMessage: 'Invalid address'
})

errors.create({
  name: 'InvalidAssetIdError',
  code: 10002,
  status: 422,
  defaultMessage: 'Invalid asset ID'
})

errors.create({
  name: 'InvalidTxidError',
  code: 10003,
  status: 422,
  defaultMessage: 'Invalid transaction ID'
})

// block-explorer errors

errors.create({
  name: 'ResolutionTooHighError',
  code: 11001,
  status: 500,
  defaultMessage: 'Sample resolution too high'
})

errors.create({
  name: 'BlocksRangeTooHighError',
  code: 11002,
  status: 500,
  defaultMessage: 'Requested blocks range is too high'
})

module.exports = errors
